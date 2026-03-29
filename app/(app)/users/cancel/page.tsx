import { PlaceholderPage } from "@/components/shared/placeholder-page"
import { usersRoutes } from "@/features/users"

export default function UserCancelPage() {
  return (
    <PlaceholderPage
      eyebrow="Users"
      title="ユーザー退会"
      description="危険操作の確認フローを載せるための退会ページです。"
      links={usersRoutes}
    />
  )
}
