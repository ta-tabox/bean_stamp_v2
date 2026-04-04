import { RoasterNewPageContent } from "@/features/profiles/components/ProfilePageContents"
import { requireNoRoasterMembership } from "@/server/auth/guards"
import { createRoasterProfileAction } from "@/server/profiles/actions"

export default async function RoasterNewPage() {
  await requireNoRoasterMembership()

  return <RoasterNewPageContent action={createRoasterProfileAction} />
}
