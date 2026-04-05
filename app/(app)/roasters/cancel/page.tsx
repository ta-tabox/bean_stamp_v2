import { DangerZonePageContent } from "@/features/profiles/components/ProfilePageContents"
import { requireRoasterMembership } from "@/server/auth/guards"
import { deleteRoasterProfileAction } from "@/server/profiles/actions"

export default async function RoasterCancelPage() {
  await requireRoasterMembership()

  return (
    <DangerZonePageContent
      action={deleteRoasterProfileAction}
      title="ロースター終了"
      heading="ロースターを削除する"
      description="フォロー関係も同時に削除されます。Bean や Offer が紐付く場合は削除できないことがあります。"
      submitLabel="ロースターを削除する"
    />
  )
}
