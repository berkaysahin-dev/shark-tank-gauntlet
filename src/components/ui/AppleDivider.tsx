import { cn } from "@/lib/utils";

interface AppleDividerProps {
  className?: string;
  glow?: boolean;
}

export function AppleDivider({ className, glow = false }: AppleDividerProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-8 overflow-hidden select-none pointer-events-none",
        className
      )}
    >
      <div className="relative w-full h-px">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/[0.08] dark:via-white/[0.16] to-transparent" />
        {glow && (
          <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-64 h-3 bg-gradient-to-r from-transparent via-accent/25 to-transparent blur-sm pointer-events-none" />
        )}
      </div>
    </div>
  );
}
