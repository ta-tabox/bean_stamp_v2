import { PlaceholderPage } from "@/components/shared/placeholder-page"
import { usersRoutes } from "@/features/users"

export default function UserPasswordPage() {
  return (
    <PlaceholderPage
      eyebrow="Users"
      title="パスワード変更"
      description="認証情報変更系の UI はこのルート配下に集約します。"
      links={usersRoutes}
    />
  )
}
