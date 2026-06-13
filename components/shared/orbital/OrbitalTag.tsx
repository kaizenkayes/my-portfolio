import { cn } from "@/lib/utils";

interface OrbitalTagProps {
  label: string;
  colorClass: string;
  positionClass: string;
  delay: string;
}

export function OrbitalTag({ label, colorClass, positionClass, delay }: OrbitalTagProps) {
  return (
    <div
      className={cn(
        "absolute cursor-default rounded-[10px] px-3.5 py-[7px] font-mono text-xs font-bold whitespace-nowrap select-none",
        "transition-transform duration-200 hover:scale-[1.12] hover:[transform:scale(1.12)_translateZ(30px)]",
        "animate-[otag-float_4s_ease-in-out_infinite]",
        colorClass,
        positionClass
      )}
      style={{ animationDelay: delay }}
    >
      {label}
    </div>
  );
}
