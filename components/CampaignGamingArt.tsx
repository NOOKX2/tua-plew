type Props = {
  className?: string;
  variant?: "card" | "hero";
};

export default function CampaignGamingArt({
  className = "",
  variant = "card",
}: Props) {
  const titleSize =
    variant === "hero"
      ? "text-4xl sm:text-6xl lg:text-7xl"
      : "text-2xl sm:text-3xl";
  const subSize = variant === "hero" ? "text-sm sm:text-base" : "text-[10px] sm:text-xs";

  return (
    <div
      className={`absolute inset-0 grid grid-cols-2 ${className}`}
      aria-hidden
    >
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1a0f3d] via-[#2d1b69] to-[#7c3aed]">
        <div className="absolute -left-8 top-6 h-32 w-32 rounded-full bg-amber-400/20 blur-2xl" />
        <div className="absolute bottom-0 right-0 h-40 w-40 rounded-full bg-fuchsia-500/25 blur-3xl" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute left-[12%] top-[18%] h-16 w-16 rotate-12 rounded-lg border-2 border-amber-300/40 bg-amber-400/10" />
          <div className="absolute left-[28%] top-[42%] h-10 w-10 -rotate-6 rounded-md border border-white/20 bg-white/5" />
          <div className="absolute bottom-[22%] left-[18%] h-20 w-20 rotate-45 rounded-full border border-amber-200/30" />
        </div>
        <div className="relative flex h-full flex-col items-center justify-center px-3 text-center">
          <p
            className={`${titleSize} font-black uppercase tracking-tight text-amber-300 drop-shadow-[0_4px_24px_rgba(251,191,36,0.45)]`}
          >
            ROV
          </p>
          <p className={`${subSize} mt-1 font-semibold uppercase tracking-[0.2em] text-violet-100/90`}>
            Realm of Valor
          </p>
        </div>
      </div>

      <div className="relative overflow-hidden bg-gradient-to-br from-[#00a2ff] via-[#3b82f6] to-[#22c55e]">
        <div className="absolute -right-6 top-4 h-28 w-28 rounded-full bg-white/25 blur-2xl" />
        <div className="absolute bottom-0 left-0 h-36 w-36 rounded-full bg-lime-300/30 blur-3xl" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute right-[14%] top-[20%] h-14 w-14 rounded-sm bg-white/25 shadow-lg" />
          <div className="absolute right-[32%] top-[34%] h-9 w-9 rounded-sm bg-emerald-300/40" />
          <div className="absolute bottom-[24%] right-[20%] h-16 w-16 rounded-sm bg-sky-200/35" />
          <div className="absolute bottom-[18%] right-[38%] h-8 w-8 rounded-sm bg-white/20" />
        </div>
        <div className="relative flex h-full flex-col items-center justify-center px-3 text-center">
          <p
            className={`${titleSize} font-black tracking-tight text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.35)]`}
          >
            Roblox
          </p>
          <p className={`${subSize} mt-1 font-semibold uppercase tracking-[0.18em] text-sky-50/95`}>
            In-game code
          </p>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-white/40 shadow-[0_0_12px_rgba(255,255,255,0.35)]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white/50 bg-zinc-950/70 text-xs font-bold text-white shadow-lg backdrop-blur-sm sm:h-12 sm:w-12 sm:text-sm">
        +
      </div>
    </div>
  );
}

export function isGamingCodeCampaign(campaignId: string) {
  return campaignId === "rent-10-gaming-reward";
}
