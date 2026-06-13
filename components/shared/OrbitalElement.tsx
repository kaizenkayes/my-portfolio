"use client";

import { OrbitalTag } from "./orbital/OrbitalTag";
import { ORBITAL_TAGS, ORBITAL_TAG_POSITIONS } from "./orbital/constants";

export function OrbitalElement() {
  return (
    <div className="relative h-[420px] w-[420px] [perspective:900px] max-md:h-[300px] max-md:w-[300px]">
      <div className="relative h-full w-full [transform-style:preserve-3d] animate-[orbital-spin_18s_linear_infinite]">
        <div className="pointer-events-none absolute top-1/2 left-1/2 h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] border-[rgba(87,70,229,0.22)] animate-[ring-spin-1_12s_linear_infinite] [margin:-110px_0_0_-110px]" />
        <div className="pointer-events-none absolute top-1/2 left-1/2 h-[290px] w-[290px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] border-[rgba(234,179,8,0.18)] animate-[ring-spin-2_20s_linear_infinite_reverse] [margin:-145px_0_0_-145px]" />

        <div className="absolute top-1/2 left-1/2 flex h-[90px] w-[90px] -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-[18px] bg-indigo-800 transition-transform duration-200 hover:scale-110 animate-[core-pulse_3s_ease-in-out_infinite] [margin:-45px_0_0_-45px]">
          <span className="text-center font-mono text-[11px] leading-snug font-bold text-white select-none">
            {"</>"}
            <br />
            Full
            <br />
            Stack
          </span>
        </div>

        {ORBITAL_TAGS.map((tag, i) => (
          <OrbitalTag
            key={tag.label}
            label={tag.label}
            colorClass={tag.colorClass}
            positionClass={ORBITAL_TAG_POSITIONS[i]}
            delay={tag.delay}
          />
        ))}
      </div>
    </div>
  );
}
