"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Flowing "line waves" surface — the reflective motif at the centre of the LULU
 * brand, reimagined as a full-screen fragment shader. A pair of layered sine
 * fields are warped, masked top/bottom, and resolved into stacked contour lines
 * whose RGB channels drift on independent cycles. Built on the site's existing
 * three / r3f stack (no extra deps).
 *
 * Perf: the render loop is gated to the viewport via IntersectionObserver, so
 * the GPU rests once the hero scrolls away. prefers-reduced-motion renders a
 * single static frame instead of animating.
 */

type Props = {
  speed?: number;
  innerLines?: number;
  outerLines?: number;
  warp?: number;
  rotation?: number; // degrees
  edgeFade?: number;
  colorCycle?: number;
  brightness?: number;
  color1?: string;
  color2?: string;
  color3?: string;
  mouse?: boolean;
  mouseInfluence?: number;
};

const hexToRGB = (hex: string): [number, number, number] => {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ];
};

// Pass-through quad: ignore the camera and cover clip space directly. The
// plane geometry spans -1..1 locally, so position.xy is already NDC.
const vert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const frag = /* glsl */ `
  uniform float uTime;
  uniform vec3  uRes;
  uniform float uSpeed;
  uniform float uInner;
  uniform float uOuter;
  uniform float uWarp;
  uniform float uRot;
  uniform float uEdgeFade;
  uniform float uCycle;
  uniform float uBright;
  uniform vec3  uC1;
  uniform vec3  uC2;
  uniform vec3  uC3;
  uniform vec2  uMouse;
  uniform float uMouseInf;

  const float HALF_PI = 1.5707963;

  float hash1(float n) { return fract(sin(n * 127.1) * 43758.5453123); }

  float vnoise(float x) {
    float i = floor(x);
    float f = fract(x);
    float u = f * f * (3.0 - 2.0 * f);
    return mix(hash1(i), hash1(i + 1.0), u);
  }

  // Two distinct multi-octave sine displacements.
  float swellA(float c, float t) {
    return sin(c * 2.123) * 0.2
         + sin(c * 3.234 + t * 4.345) * 0.1
         + sin(c * 0.589 + t * 0.934) * 0.5;
  }
  float swellB(float c, float t) {
    return sin(c * 1.345) * 0.3
         + sin(c * 2.734 + t * 3.345) * 0.2
         + sin(c * 0.189 + t * 0.934) * 0.3;
  }

  vec2 spin(vec2 p, float a) {
    float c = cos(a), s = sin(a);
    return vec2(p.x * c - p.y * s, p.x * s + p.y * c);
  }

  void main() {
    vec2 p = (gl_FragCoord.xy / uRes.xy) * 2.0 - 1.0;
    p = spin(p, uRot);

    float halfT = uTime * uSpeed * 0.5;
    float fullT = uTime * uSpeed;

    float mWarp = 0.0;
    if (uMouseInf > 0.0) {
      vec2 m = spin(uMouse * 2.0 - 1.0, uRot);
      float d = length(p - m);
      mWarp = uMouseInf * exp(-d * d * 4.0);
    }

    vec2 fa = vec2(
      p.x + swellA(p.y, halfT) * uWarp + mWarp,
      p.y - swellA(p.x * cos(fullT) * 1.235, halfT) * uWarp
    );
    vec2 fb = vec2(
      p.x + swellB(p.y, halfT) * uWarp + mWarp,
      p.y - swellB(p.x * sin(fullT) * 1.235, halfT) * uWarp
    );
    vec2 field = mix(fa, fb, mix(fa, fb, 0.5));

    float fadeT = smoothstep(uEdgeFade, uEdgeFade + 0.4, field.y);
    float fadeB = smoothstep(-uEdgeFade, -(uEdgeFade + 0.4), field.y);
    float mask  = 1.0 - max(fadeT, fadeB);

    float tiles = mix(uOuter, uInner, mask);
    float sY = field.y * tiles;
    float nY = vnoise(abs(sY));

    float ridge = pow(
      step(abs(nY - field.x) * 2.0, HALF_PI) * cos(2.0 * (nY - field.x)),
      5.0
    );

    float lines = 0.0;
    for (float i = 1.0; i < 3.0; i += 1.0) {
      lines += pow(max(fract(sY), fract(-sY)), i * 2.0);
    }

    float base = mask * lines;
    float ct = fullT * uCycle;
    float rC = (base + lines * ridge) * (cos(field.y + ct * 0.234) * 0.5 + 1.0);
    float gC = (base + mask  * ridge) * (sin(field.x + ct * 1.745) * 0.5 + 1.0);
    float bC = (base + lines * ridge) * (cos(field.x + ct * 0.534) * 0.5 + 1.0);

    vec3 col = (rC * uC1 + gC * uC2 + bC * uC3) * uBright;
    gl_FragColor = vec4(col, clamp(length(col), 0.0, 1.0));
  }
`;

// A frozen timestamp that lands on a pleasant, settled pattern.
const STATIC_T = 6.0;

function Waves({
  reduced,
  speed,
  innerLines,
  outerLines,
  warp,
  rotation,
  edgeFade,
  colorCycle,
  brightness,
  color1,
  color2,
  color3,
  mouse,
  mouseInfluence,
}: Required<Props> & { reduced: boolean }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { gl, size, pointer, invalidate } = useThree();
  const cursor = useRef<[number, number]>([0.5, 0.5]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector3(1, 1, 1) },
      uSpeed: { value: speed },
      uInner: { value: innerLines },
      uOuter: { value: outerLines },
      uWarp: { value: warp },
      uRot: { value: (rotation * Math.PI) / 180 },
      uEdgeFade: { value: edgeFade },
      uCycle: { value: colorCycle },
      uBright: { value: brightness },
      uC1: { value: new THREE.Vector3(...hexToRGB(color1)) },
      uC2: { value: new THREE.Vector3(...hexToRGB(color2)) },
      uC3: { value: new THREE.Vector3(...hexToRGB(color3)) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uMouseInf: { value: mouse ? mouseInfluence : 0 },
    }),
    // built once; live values are pushed in the frame loop below
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  // Keep scalar uniforms in sync if props change without a remount.
  useEffect(() => {
    const u = mat.current?.uniforms;
    if (!u) return;
    u.uSpeed.value = speed;
    u.uInner.value = innerLines;
    u.uOuter.value = outerLines;
    u.uWarp.value = warp;
    u.uRot.value = (rotation * Math.PI) / 180;
    u.uEdgeFade.value = edgeFade;
    u.uCycle.value = colorCycle;
    u.uBright.value = brightness;
    u.uC1.value.set(...hexToRGB(color1));
    u.uC2.value.set(...hexToRGB(color2));
    u.uC3.value.set(...hexToRGB(color3));
    u.uMouseInf.value = mouse ? mouseInfluence : 0;
    invalidate();
  }, [speed, innerLines, outerLines, warp, rotation, edgeFade, colorCycle, brightness, color1, color2, color3, mouse, mouseInfluence, invalidate]);

  // Resolution follows the drawing buffer (CSS size × pixel ratio). Under
  // reduced motion we render on demand, so nudge a redraw when the size shifts.
  useEffect(() => {
    const u = mat.current?.uniforms;
    if (!u) return;
    const dpr = gl.getPixelRatio();
    u.uRes.value.set(size.width * dpr, size.height * dpr, size.width / Math.max(size.height, 1));
    if (reduced) invalidate();
  }, [size.width, size.height, gl, reduced, invalidate]);

  useFrame((state) => {
    const u = mat.current?.uniforms;
    if (!u) return;

    if (reduced) {
      u.uTime.value = STATIC_T;
      return;
    }

    u.uTime.value = state.clock.elapsedTime;

    if (mouse) {
      // pointer is NDC (-1..1, y up); shader wants 0..1
      const tx = pointer.x * 0.5 + 0.5;
      const ty = pointer.y * 0.5 + 0.5;
      cursor.current[0] += 0.05 * (tx - cursor.current[0]);
      cursor.current[1] += 0.05 * (ty - cursor.current[1]);
      u.uMouse.value.set(cursor.current[0], cursor.current[1]);
    }
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={mat}
        vertexShader={vert}
        fragmentShader={frag}
        uniforms={uniforms}
        transparent
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}

export default function LineWaves({
  speed = 0.3,
  innerLines = 32,
  outerLines = 36,
  warp = 1.0,
  rotation = -45,
  edgeFade = 0.0,
  colorCycle = 1.0,
  brightness = 0.2,
  color1 = "#ffffff",
  color2 = "#ffffff",
  color3 = "#ffffff",
  mouse = true,
  mouseInfluence = 2.0,
}: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.01 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const animate = inView && !reduced;
  // "always" while visible; pause to "never" off-screen; "demand" renders the
  // single static frame for reduced motion.
  const frameloop = animate ? "always" : reduced ? "demand" : "never";

  return (
    <div ref={hostRef} style={{ position: "absolute", inset: 0 }}>
      <Canvas
        frameloop={frameloop}
        dpr={[1, 1.5]}
        orthographic
        camera={{ position: [0, 0, 1] }}
        gl={{ alpha: true, antialias: false, premultipliedAlpha: false }}
        style={{ position: "absolute", inset: 0 }}
      >
        <Waves
          reduced={reduced}
          speed={speed}
          innerLines={innerLines}
          outerLines={outerLines}
          warp={warp}
          rotation={rotation}
          edgeFade={edgeFade}
          colorCycle={colorCycle}
          brightness={brightness}
          color1={color1}
          color2={color2}
          color3={color3}
          mouse={mouse}
          mouseInfluence={mouseInfluence}
        />
      </Canvas>
    </div>
  );
}
