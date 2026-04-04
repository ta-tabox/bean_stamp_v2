export function NotificationPanel() {
  return (
    <aside className="page-card">
      <p className="panel-label">NOTIFICATION</p>
      <h2 className="title-font mt-3 text-xl text-[var(--color-fg)]">通知表示領域</h2>
      <div className="mt-4 space-y-3 text-sm leading-6 text-[var(--color-muted)]">
        <p className="detail-tile">
          Wants、Offers などの統計 API を後続 issue で接続する前提のプレースホルダーです。
        </p>
        <p className="detail-tile">デスクトップでは右カラム、モバイルでは本文下に表示されます。</p>
      </div>
    </aside>
  )
}
