import { PlaceholderPage } from "@/components/shared/PlaceholderPage"
import { usersRoutes } from "@/features/users"

export default function UserEditPage() {
  return (
    <PlaceholderPage
      eyebrow="Users"
      title="プロフィール編集"
      description="ユーザー編集画面の移行先です。"
      links={usersRoutes}
    />
  )
}
