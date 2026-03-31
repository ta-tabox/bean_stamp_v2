import { PlaceholderPage } from "@/components/shared/PlaceholderPage"
import { publicRoutes } from "@/features/public"

export default function AboutPage() {
  return (
    <PlaceholderPage
      eyebrow="Public"
      title="About"
      description="旧 About 画面の差し替え先です。共通ヘッダーと公開ナビゲーションの下でサービス紹介を表示する構成にしています。"
      links={publicRoutes}
    />
  )
}
