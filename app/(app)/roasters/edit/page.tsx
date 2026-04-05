import { RoasterEditPageContent } from "@/features/profiles/components/ProfilePageContents"
import { requireRoasterMembership } from "@/server/auth/guards"
import { updateRoasterProfileAction } from "@/server/profiles/actions"
import { getRoasterProfile } from "@/server/profiles/service"

export default async function RoasterEditPage() {
  const session = await requireRoasterMembership()
  const roaster = await getRoasterProfile(session.roasterId!, session.id)

  return (
    <RoasterEditPageContent
      action={updateRoasterProfileAction}
      roaster={roaster}
    />
  )
}
