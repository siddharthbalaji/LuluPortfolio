"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * A slow, rippling plane that reads as the surface of deep water — the
 * reflective motif at the centre of the LULU brand. Vertices are displaced by
 * layered sine waves; colour is mixed from the site palette by depth so the
 * trough sits in #0A1931 and crests catch #4A7FA7 / #B3CFE5.
 */
function WaterPlane() {
  const mesh = useRef<THREE.Mesh>(null);
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { pointer } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uAbyss: { value: new THREE.Color("#0A1931") },
      uDeep: { value: new THREE.Color("#1A3D63") },
      uTide: { value: new THREE.Color("#4A7FA7") },
      uMist: { value: new THREE.Color("#B3CFE5") },
    }),
    []
  );

  useFrame((_, delta) => {
    if (!mat.current) return;
    mat.current.uniforms.uTime.value += delta;
    const p = mat.current.uniforms.uPointer.value as THREE.Vector2;
    p.x += (pointer.x - p.x) * 0.04;
    p.y += (pointer.y - p.y) * 0.04;
  });

  return (
    <mesh ref={mesh} rotation={[-Math.PI / 2.35, 0, 0]} position={[0, -1.1, 0]}>
      <planeGeometry args={[34, 22, 180, 120]} />
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        wireframe
        transparent
        vertexShader={
          /* glsl */ `
          uniform float uTime;
          uniform vec2 uPointer;
          varying float vElev;
          void main() {
            vec3 p = position;
            float t = uTime * 0.5;
            float e =
              sin(p.x * 0.6 + t) * 0.45 +
              sin(p.y * 0.8 + t * 1.3) * 0.35 +
              sin((p.x + p.y) * 0.4 + t * 0.7) * 0.30;
            // gentle pointer-driven swell
            float d = distance(vec2(p.x, p.y), uPointer * 8.0);
            e += smoothstep(6.0, 0.0, d) * 0.6 * sin(t * 2.0 - d);
            p.z += e;
            vElev = e;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
          }
        `
        }
        fragmentShader={
          /* glsl */ `
          uniform vec3 uAbyss;
          uniform vec3 uDeep;
          uniform vec3 uTide;
          uniform vec3 uMist;
          varying float vElev;
          void main() {
            float h = clamp((vElev + 1.0) * 0.5, 0.0, 1.0);
            vec3 c = mix(uAbyss, uDeep, smoothstep(0.0, 0.5, h));
            c = mix(c, uTide, smoothstep(0.45, 0.8, h));
            c = mix(c, uMist, smoothstep(0.8, 1.0, h));
            float a = 0.22 + h * 0.55;
            gl_FragColor = vec4(c, a);
          }
        `
        }
      />
    </mesh>
  );
}

export default function WaterScene() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 2.4, 9], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      style={{ position: "absolute", inset: 0 }}
    >
      <fog attach="fog" args={["#0A1931", 9, 22]} />
      <WaterPlane />
    </Canvas>
  );
}
