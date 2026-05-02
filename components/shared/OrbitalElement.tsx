"use client";

const TAGS = [
  { label: "Node.js",  bg: "otag--gold",   delay: "0s"    },
  { label: "MongoDB",  bg: "otag--indigo",  delay: "0.4s"  },
  { label: "React",    bg: "otag--blue",    delay: "0.8s"  },
  { label: "Express",  bg: "otag--teal",    delay: "1.2s"  },
  { label: "Redis",    bg: "otag--purple",  delay: "1.6s"  },
  { label: "Next.js",  bg: "otag--amber",   delay: "2s"    },
];

const POSITIONS = [
  "otag--top",
  "otag--right",
  "otag--bottom",
  "otag--left",
  "otag--top-right",
  "otag--bottom-left",
];

export function OrbitalElement() {
  return (
    <div className="orbital-scene">
      <div className="orbital-wrapper">
        <div className="orbital-ring orbital-ring--1" />
        <div className="orbital-ring orbital-ring--2" />

        <div className="orbital-core">
          <span className="orbital-core__text">
            {"</>"}<br />Full<br />Stack
          </span>
        </div>

        {TAGS.map((tag, i) => (
          <div
            key={tag.label}
            className={`otag ${tag.bg} ${POSITIONS[i]}`}
            style={{ animationDelay: tag.delay }}
          >
            {tag.label}
          </div>
        ))}
      </div>
    </div>
  );
}