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
    "I'm a product-focused visual designer with a background spanning UI/UX, graphic design, illustration, and motion graphics. My MA in Illustration & Animation from Coventry University sharpened my craft and storytelling instincts, while my Computer Science engineering degree gives me a strong technical foundation.",
    "I bring a detail-driven approach that balances aesthetics, usability, and innovation — and I'm fluent in the latest AI tools reshaping how we design.",
  ],
  location: "Chennai, India",
  email: "sidofficial7801@gmail.com",
  phone: "+91 73389 02566",
  phoneHref: "+917338902566",
  linkedin: "https://www.linkedin.com/in/siddharthbalaji/",
  linkedinLabel: "linkedin.com/in/siddharthbalaji",
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
  "UI / UX Design", "Motion Graphics", "After Effects", "Illustration",
  "Figma", "Blender", "AI-Augmented Design", "Storyboarding",
  "Framer", "Coventry University MA", "Clip Studio Paint", "MidJourney",
];

export const TRAITS = [
  {
    name: "Motion-First Thinker",
    desc: "Animation and motion graphics aren't an afterthought — they're central to how I communicate ideas and emotion in design.",
  },
  {
    name: "AI-Augmented Creator",
    desc: "I actively integrate MidJourney, Adobe Firefly, Runway, and Claude into my workflow to accelerate ideation and push creative limits.",
  },
  {
    name: "Storyteller at Heart",
    desc: "From storyboarding animation series to crafting social video ads, I design narratives — not just interfaces.",
  },
  {
    name: "Cross-Disciplinary",
    desc: "With roots in computer science and a master's in illustration, I bridge technical constraints with creative ambition.",
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
    date: "Sept 2023 — Sept 2024 · Coventry, UK",
    note: 'Modules in "Collaboration in Practice" and "Professional Context" built strong team management and professional design-practice skills.',
  },
  {
    icon: "be",
    school: "Chennai Institute of Technology",
    degree: "BE — Computer Science & Engineering",
    date: "Jul 2019 — Jul 2023 · Chennai, India",
    note: '"Engineering Graphics" bridged technical precision with visual communication — the backbone of my design thinking.',
  },
];

export const BRAND = {
  intro: "LULU — a personal brand built on reflection, duality, and the poetry of Japanese form.",
  steps: [
    {
      idx: "01",
      kicker: "Origin",
      title: "The Origin Glyph",
      body: "The Japanese katakana ル (lu) is the phonetic seed of LULU — repeated to visually form ルル, reading 'Lulu'.",
    },
    {
      idx: "02",
      kicker: "Reflect",
      title: "The 180° Reflection",
      body: "Rotate ル exactly 180° and place it below the original. Two halves that slot together — like a reflection in still water.",
    },
    {
      idx: "03",
      kicker: "Mark",
      title: "ルル · LULU",
      body: "Together they read ルル — the finished mark, drawn directly from my alias 'Lulu'.",
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
