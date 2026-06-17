import Link from "next/link";

export default function AdminEntityList({
  title,
  description,
  newHref,
  newLabel,
  items,
  emptyLabel,
}: {
  title: string;
  description: string;
  newHref: string;
  newLabel: string;
  emptyLabel: string;
  items: { id: string; title: string; subtitle?: string; meta?: string }[];
}) {
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">{title}</h1>
          <p className="mt-1 text-sm text-zinc-500">{description}</p>
        </div>
        <Link
          href={newHref}
          className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          {newLabel}
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-zinc-200 bg-white px-4 py-8 text-center text-sm text-zinc-500">
          {emptyLabel}
        </p>
      ) : (
        <ul className="divide-y divide-zinc-100 overflow-hidden rounded-xl border border-zinc-200 bg-white">
          {items.map((item) => (
            <li key={item.id}>
              <Link
                href={`${newHref.replace("/new", "")}/${item.id}`}
                className="flex items-center justify-between gap-4 px-4 py-3.5 transition-colors hover:bg-zinc-50"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-zinc-900">{item.title}</p>
                  {item.subtitle ? (
                    <p className="truncate text-sm text-zinc-500">{item.subtitle}</p>
                  ) : null}
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-mono text-xs text-zinc-400">{item.id}</p>
                  {item.meta ? (
                    <p className="text-xs text-zinc-500">{item.meta}</p>
                  ) : null}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
