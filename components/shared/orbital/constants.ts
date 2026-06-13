export const ORBITAL_TAGS = [
  { label: "Node.js", colorClass: "bg-yellow-500 text-[#1c1100]", delay: "0s" },
  { label: "MongoDB", colorClass: "bg-indigo-800 text-white", delay: "0.4s" },
  { label: "React", colorClass: "bg-blue-700 text-white", delay: "0.8s" },
  { label: "Express", colorClass: "bg-teal-600 text-white", delay: "1.2s" },
  { label: "Redis", colorClass: "bg-violet-600 text-white", delay: "1.6s" },
  { label: "Next.js", colorClass: "bg-amber-700 text-white", delay: "2s" },
] as const;

export const ORBITAL_TAG_POSITIONS = [
  "top-[-5%] left-1/2 -translate-x-1/2 [transform:translateX(-50%)_translateZ(130px)]",
  "top-1/2 right-[-8%] -translate-y-1/2 [transform:translateY(-50%)_translateZ(90px)_rotateY(-30deg)]",
  "bottom-[-5%] left-1/2 -translate-x-1/2 [transform:translateX(-50%)_translateZ(110px)]",
  "top-1/2 left-[-8%] -translate-y-1/2 [transform:translateY(-50%)_translateZ(90px)_rotateY(30deg)]",
  "top-[12%] right-[2%] [transform:translateZ(60px)]",
  "bottom-[12%] left-[2%] [transform:translateZ(70px)]",
] as const;
