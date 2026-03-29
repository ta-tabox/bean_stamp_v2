import { PlaceholderPage } from "@/components/shared/placeholder-page"
import { publicRoutes } from "@/features/public"

export default function HelpPage() {
  return (
    <PlaceholderPage
      eyebrow="Public"
      title="Help"
      description="ヘルプページの移行先です。FAQ や問い合わせ導線はこのルートに集約します。"
      links={publicRoutes}
    />
  )
}
