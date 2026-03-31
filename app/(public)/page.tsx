import { PlaceholderPage } from "@/components/shared/PlaceholderPage"
import { appRoutes } from "@/features/app"
import { authRoutes } from "@/features/auth"
import { publicRoutes } from "@/features/public"

export default function PublicHomePage() {
  return (
    <PlaceholderPage
      eyebrow="Public"
      title="公開ルートの入口"
      description="トップ・About・Help の公開ページは共通ヘッダー配下で表示されます。下のリンクから認証ルートと主要アプリ導線にも移動できます。"
      links={[...publicRoutes, ...authRoutes, ...appRoutes.slice(0, 8)]}
    />
  )
}
