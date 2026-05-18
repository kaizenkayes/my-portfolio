import Link from "next/link";

import { StatProps } from "@/types";

export function StatCards({ stats }: { stats: StatProps[] }) {
  return (
    <section>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group block no-underline"
          >
            <div
              className={`glass-card p-7 transition-all duration-300 group-hover:-translate-y-1 border-t-2 ${
                stat.accent === "indigo"
                  ? "border-indigo-400"
                  : "border-yellow-400"
              }`}
            >
              <p className="text-[9px] font-bold tracking-[0.3em] uppercase text-[var(--text-dim)] mb-3">
                {stat.label}
              </p>

              <p
                className={`text-[3rem] font-black tracking-[-2px] leading-none mb-1.5 ${
                  stat.accent === "indigo"
                    ? "text-indigo-400"
                    : "text-yellow-400"
                }`}
              >
                {stat.value}
              </p>

              <p className="text-[0.8rem] text-[var(--text-dim)]">{stat.sub}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
