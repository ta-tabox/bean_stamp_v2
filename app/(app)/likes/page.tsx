import { PlaceholderPage } from "@/components/shared/placeholder-page"
import { likesRoutes } from "@/features/likes"

export default function LikesPage() {
  return (
    <PlaceholderPage
      eyebrow="Likes"
      title="Like 一覧"
      description="いいね一覧ページのルートです。"
      links={likesRoutes}
    />
  )
}
