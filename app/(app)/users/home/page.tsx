import { PlaceholderPage } from "@/components/shared/placeholder-page"
import { usersRoutes } from "@/features/users"

export default function UsersHomePage() {
  return (
    <PlaceholderPage
      eyebrow="Users"
      title="ユーザーホーム"
      description="旧 `/users/home` に対応するログイン後のホームです。"
      links={usersRoutes}
    />
  )
}
