export function NotificationPanel() {
  return (
    <aside className="rounded-[1.75rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-5 shadow-[0_18px_40px_rgba(86,52,28,0.06)]">
      <p className="text-xs font-semibold tracking-[0.32em] text-[var(--color-accent)]">
        NOTIFICATION
      </p>
      <h2 className="mt-3 text-xl font-semibold text-[var(--color-fg)]">通知表示領域</h2>
      <div className="mt-4 space-y-3 text-sm leading-6 text-[var(--color-ink-soft)]">
        <p className="rounded-2xl border border-[var(--color-border)] bg-white/70 px-4 py-3">
          Wants、Offers などの統計 API を後続 issue で接続する前提のプレースホルダーです。
        </p>
        <p className="rounded-2xl border border-[var(--color-border)] bg-white/70 px-4 py-3">
          デスクトップでは右カラム、モバイルでは本文下に表示されます。
        </p>
      </div>
    </aside>
  )
}
