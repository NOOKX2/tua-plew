import { getTranslator } from "@/lib/i18n/server";

const TIERS = [
  { key: "essential", accent: "from-blue-500 to-blue-600", emoji: "🏃" },
  { key: "studio", accent: "from-violet-500 to-fuchsia-500", emoji: "🧘" },
  { key: "tactical", accent: "from-zinc-700 to-zinc-900", emoji: "🔥" },
] as const;

export default async function ApparelTiers() {
  const t = await getTranslator();

  return (
    <section className="mx-auto w-full max-w-7xl scroll-mt-24 px-4 pt-2 pb-8 sm:px-6 sm:pb-10">
      <div className="mb-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
          {t("apparelTiers.eyebrow")}
        </p>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
          {t("apparelTiers.title")}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-500">
          {t("apparelTiers.subtitle")}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TIERS.map((tier) => (
          <article
            key={tier.key}
            className="flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-md"
          >
            <div
              className={`flex items-center gap-3 bg-gradient-to-br ${tier.accent} px-5 py-4 text-white`}
            >
              <span className="text-2xl" aria-hidden>
                {tier.emoji}
              </span>
              <div className="min-w-0">
                <h3 className="text-base font-bold leading-tight">
                  {t(`apparelTiers.tiers.${tier.key}.name`)}
                </h3>
                <p className="mt-0.5 text-[11px] font-medium text-white/80">
                  {t(`apparelTiers.tiers.${tier.key}.segment`)}
                </p>
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-3 p-5">
              <p className="text-sm leading-relaxed text-zinc-600">
                {t(`apparelTiers.tiers.${tier.key}.description`)}
              </p>

              <p className="rounded-xl bg-zinc-50 px-3 py-2.5 text-xs leading-relaxed text-zinc-600 ring-1 ring-zinc-100">
                {t(`apparelTiers.tiers.${tier.key}.feature`)}
              </p>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                  {t("apparelTiers.forLabel")}
                </p>
                <p className="mt-0.5 text-xs text-zinc-600">
                  {t(`apparelTiers.tiers.${tier.key}.forWho`)}
                </p>
              </div>

              <div className="mt-auto border-t border-zinc-100 pt-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                  {t("apparelTiers.priceLabel")}
                </p>
                <p className="mt-0.5 text-lg font-bold text-blue-600">
                  {t(`apparelTiers.tiers.${tier.key}.price`)}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <p className="mt-4 text-center text-xs text-zinc-400">
        {t("apparelTiers.perRentalNote")}
      </p>
    </section>
  );
}
