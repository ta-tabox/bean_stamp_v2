import { PlaceholderPage } from "@/components/shared/PlaceholderPage"
import { publicRoutes } from "@/features/public"

export default function HelpPage() {
  return (
    <PlaceholderPage
      eyebrow="Public"
      title="Help"
      description="ヘルプページの移行先です。FAQ や問い合わせ導線を共通ヘッダー配下へ集約する前提の画面です。"
      links={publicRoutes}
    />
  )
}
