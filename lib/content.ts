// CONTENT LAYER — Siddharth Balaji
// All biographical content sourced strictly from the provided profile.

export const PROFILE = {
  name: "Siddharth Balaji",
  alias: "Lulu",
  aliasGlyph: "ルル",
  roleLine: "Product · Visual · Motion",
  titleLead: "Product",
  titleTail: "Designer.",
  tagline:
    "A product-focused visual designer working across UI/UX, motion, and illustration — fluent in the AI tools reshaping how we design.",
  quote: "I often tell myself that everything you can imagine is real.",
  bio: [
    "I love turning messy ideas into experiences that feel simple, intuitive, and nice to look at. I spend an unreasonable amount of time nudging pixels, tweaking animations.",
    "I’m also deep into AI tools—not because they’ll replace designers, but because they’re excellent at helping me do the boring stuff while I focus on the fun part.",
    "The goal? Make things that work beautifully, look great, and don't make users question their life choices.",
  ],
  location: "Chennai, India",
  email: "sidofficial7801@gmail.com",
  phone: "+91 73389 02566",
  phoneHref: "+917338902566",
  linkedin: "https://www.linkedin.com/in/siddharthbalaji/",
  linkedinLabel: "linkedin.com/in/siddharthbalaji",
};

// X-style "post" card shown in the About section. The display name and handle
// are intentionally separate from PROFILE.name (which feeds Nav / Footer / SEO).
// `time` and `stats` are decorative chrome for the card — edit freely.
export const XCARD = {
  displayName: "Siddharth",
  handle: "@lulusidd",
  verified: true,
  avatar:
    "https://res.cloudinary.com/dxqucwyyo/image/upload/q_auto/f_auto/v1781677219/X_Profile_luxp8e.png",
  verifiedBadge:
    "https://res.cloudinary.com/dxqucwyyo/image/upload/q_auto/f_auto/v1781677218/Verified_tiys8z.png",
  time: "10:24 AM · Mar 4, 2026",
  stats: { replies: 160, reposts: 620, likes: 4700 },
};

export const ROLES = [
  "UI / UX Design",
  "Motion Graphics",
  "Illustration",
  "Graphic Design",
  "AI-Enhanced Design",
];

export const STATS = [
  { value: 2, suffix: "+", label: "Years Experience" },
  { value: 800, suffix: "+", label: "Hours of Design & Animation" },
  { value: 4, suffix: "", label: "Roles & Internships" },
];

export const MARQUEE = [
  "Motion Design", "UI/UX Design", "Visual Design", "Product Design", 
  "Brand Design", "Animation", "Creative Direction", "Visual Storytelling", 
  "Design Systems", "User Experience", "User Interface", "Creative Strategy",
];

export const TRAITS = [
  {
    name: "Motion-First Thinker",
    desc: "Animation and motion graphics are central to how I communicate ideas and emotion.",
  },
  {
    name: "Interface & Interaction",
    desc: "I design usable, polished interfaces where every transition feels considered.",
  },
  {
    name: "Storyteller at Heart",
    desc: "From storyboards to social video ads, I design narratives — not just screens.",
  },
  {
    name: "AI-Augmented Creator",
    desc: "I fold MidJourney, Firefly, Runway, and Claude into my process to push ideas further.",
  },
];

export type Job = {
  date: string;
  company: string;
  type: string;
  role: string;
  bullets: string[];
  tags: string[];
};

export const EXPERIENCE: Job[] = [
  {
    date: "2026",
    company: "MiTran Global",
    type: "Internship",
    role: "Motion Graphic & UI/UX Designer",
    bullets: [
      "Created and developed motion design concepts — storyboards and animated sequences for an original series — establishing a consistent visual style and enhancing overall user engagement.",
      "Worked with cross-functional teams on web projects, contributing to UI/UX design, user flows, spatial structuring, and the integration of interactive digital elements.",
    ],
    tags: ["Motion Graphics", "UI/UX Design", "Interaction Design", "Digital Experience"],
  },
  {
    date: "2025",
    company: "The Place to be Gallery",
    type: "Internship",
    role: "Animation Artist",
    bullets: [
      "Developed and executed animation concepts and storyboarding for an original animation series, laying a strong narrative and visual foundation for upcoming episodes.",
      "Collaborated cross-functionally on a Virtual Art Gallery, contributing to spatial design, interactive flows, and digital integration.",
    ],
    tags: ["Animation", "Storyboarding", "Virtual Gallery", "Collaboration"],
  },
  {
    date: "2021 — 2022",
    company: "Expertify",
    type: "Freelance",
    role: "Motion Graphic Designer",
    bullets: [
      "Led a motion graphic project for a professional Udemy group, resulting in a 15% increase in course engagement metrics.",
      "Delivered consistent, high-quality work that reduced editing time by one-third and streamlined delivery timelines.",
    ],
    tags: ["Motion Graphics", "After Effects", "E-Learning", "+15% Engagement"],
  },
  {
    date: "2021",
    company: "Chefathome Foodtech LLP",
    type: "Internship",
    role: "Motion Graphics Designer",
    bullets: [
      "Managed product animations and motion graphic storyboarding, enhancing average viewer retention by 10–15 seconds per video.",
      "Crafted video advertisements for 'Zang' on YouTube and Instagram, driving a 25% rise in brand awareness via user engagement.",
      "Produced promotional materials with creative copywriting and photo editing, boosting product visibility across digital platforms.",
    ],
    tags: ["Motion Graphics", "Storyboarding", "Social Ads", "+25% Brand Awareness", "Copywriting"],
  },
];

export const SKILL_GROUPS = [
  {
    icon: "design",
    title: "Design & UI/UX",
    items: ["Figma", "Framer", "Uizard", "Adobe Illustrator", "Adobe Photoshop", "Clip Studio Paint"],
  },
  {
    icon: "motion",
    title: "Motion & 3D",
    items: ["After Effects", "Premiere Pro", "Blender", "Autodesk Maya", "Unreal Engine", "Unity", "Runway"],
  },
  {
    icon: "ai",
    title: "AI & Emerging Tools",
    items: ["MidJourney", "Adobe Firefly", "DALL·E", "Claude", "Runway Gen", "Zapier"],
  },
];

export const EDUCATION = [
  {
    icon: "ma",
    school: "Coventry University",
    degree: "MA — Illustration & Animation",
    date: "Sept 2023 — Sept 2024 · UK",
    image:
      "https://res.cloudinary.com/dxqucwyyo/image/upload/q_auto/f_auto/CU_Image_mon7dm.png",
  },
  {
    icon: "be",
    school: "Chennai Institute of Technology",
    degree: "BE — Computer Science & Engineering",
    date: "Jul 2019 — Jul 2023 · India",
    image:
      "https://res.cloudinary.com/dxqucwyyo/image/upload/q_auto/f_auto/CIT_Image_knhwlu.png",
  },
];

export const BRAND = {
  intro: "LULU — a personal brand built on reflection, duality, and the poetry of Japanese form. It is also a nickname/alias that I commonly use.",
  steps: [
    {
      idx: "01",
      kicker: "Origin",
      title: "The Origin Glyph",
      body: "The Japanese katakana ル (lu) is the phonetic seed of LULU.",
    },
    {
      idx: "02",
      kicker: "Reflect",
      title: "The 180° Reflection",
      body: "Rotate ル exactly 180° and place it below the original ル. Two halves that slot together — forming my identity.",
    },
    {
      idx: "03",
      kicker: "Mark",
      title: "ルル · LULU",
      body: "Together they read ルル (Lulu) — the finished mark, drawn directly from my alias 'Lulu'.",
    },
  ],
};

export const NAV_LINKS = [
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#illustrations", label: "Illustration" },
  { href: "#skills", label: "Skills" },
  { href: "#brand", label: "Brand" },
];
