export function NotificationPanel({ compact = false }: { compact?: boolean }) {
  return (
    <aside className={compact ? "" : "sticky top-0 h-screen overflow-y-auto px-6 py-10"}>
      <section className="space-y-6">
        <div className="text-center">
          <h2 className="font-serif text-lg italic text-gray-600">Notification</h2>
          <p className="mt-2 text-sm leading-6 text-gray-500">
            Wants / Offers の通知表示エリアです。
          </p>
        </div>
        <div className="space-y-3">
          <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm leading-6 text-gray-600">
            通知 API 未接続のため、ここは後続実装で動的表示に切り替わります。
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm leading-6 text-gray-600">
            旧 UI と同じく、デスクトップでは右カラム固定で表示します。
          </div>
        </div>
      </section>
    </aside>
  )
}
