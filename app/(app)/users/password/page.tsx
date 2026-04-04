import { PlaceholderPage } from "@/components/shared/PlaceholderPage"
import { buildUsersRoutes } from "@/features/users"
import { requireSession } from "@/server/auth/guards"

export default async function UserPasswordPage() {
  const session = await requireSession()

  return (
    <PlaceholderPage
      eyebrow="Users"
      title="パスワード変更"
      description="認証情報変更系の UI はこのルート配下に集約します。"
      links={buildUsersRoutes(session.id)}
    />
  )
}
