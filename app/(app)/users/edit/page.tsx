import { UserEditPageContent } from "@/features/profiles/components/ProfilePageContents"
import { requireSession } from "@/server/auth/guards"
import { updateUserProfileAction } from "@/server/profiles/actions"
import { getUserProfile } from "@/server/profiles/service"

export default async function UserEditPage() {
  const session = await requireSession()
  const user = await getUserProfile(session.id)

  return (
    <UserEditPageContent
      action={updateUserProfileAction}
      user={user}
    />
  )
}
