import { PlaceholderPage } from "@/components/shared/PlaceholderPage"
import { appRoutes } from "@/features/app"
import { authRoutes } from "@/features/auth"
import { publicRoutes } from "@/features/public"

export default function PublicHomePage() {
  return (
    <PlaceholderPage
      eyebrow="Public"
      title="公開ルートの入口"
      description="トップ・About・Help は未認証でも到達できる公開ページとして配置しています。下のリンクから認証ルートとアプリ内ルートにも遷移できます。"
      links={[...publicRoutes, ...authRoutes, ...appRoutes.slice(0, 8)]}
    />
  )
}
