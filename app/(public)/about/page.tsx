import { PlaceholderPage } from "@/components/shared/placeholder-page"
import { publicRoutes } from "@/features/public"

export default function AboutPage() {
  return (
    <PlaceholderPage
      eyebrow="Public"
      title="About"
      description="サービス紹介ページの差し替え先です。旧 `About` 画面の文言とビジュアルは後続 issue で移植します。"
      links={publicRoutes}
    />
  )
}
