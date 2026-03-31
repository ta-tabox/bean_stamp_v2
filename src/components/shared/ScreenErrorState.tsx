type ScreenErrorStateProps = {
  detail?: string
  retryLabel?: string
  title: string
}

export function ScreenErrorState({
  detail,
  retryLabel = "再読み込み",
  title,
}: ScreenErrorStateProps) {
  return (
    <section className="rounded-[2rem] border border-[var(--color-border)] bg-[#fff8f4] p-6 text-[var(--color-fg)] shadow-[0_20px_60px_rgba(82,53,22,0.08)]">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-accent-strong)]">
        Screen error
      </p>
      <h2 className="mt-3 text-2xl font-semibold">{title}</h2>
      {detail ? (
        <p className="mt-3 text-sm leading-7 text-[var(--color-ink-soft)]">{detail}</p>
      ) : null}
      <div className="mt-6 inline-flex rounded-full border border-[var(--color-border)] bg-white px-4 py-2 text-sm font-medium">
        {retryLabel}
      </div>
    </section>
  )
}
