import { PlaceholderPage } from "@/components/shared/placeholder-page"
import { beansRoutes } from "@/features/beans"

export default function BeansPage() {
  return (
    <PlaceholderPage
      eyebrow="Beans"
      title="豆一覧"
      description="Bean 一覧ページのルートです。"
      links={beansRoutes}
    />
  )
}
