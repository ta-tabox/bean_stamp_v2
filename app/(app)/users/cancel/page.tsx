import { DangerZonePageContent } from "@/features/profiles/components/ProfilePageContents"
import { requireSession } from "@/server/auth/guards"
import { deleteUserProfileAction } from "@/server/profiles/actions"

export default async function UserCancelPage() {
  await requireSession()

  return (
    <DangerZonePageContent
      action={deleteUserProfileAction}
      title="ユーザー退会"
      heading="アカウントを削除する"
      description="フォロー情報もあわせて削除されます。所属ロースターがある場合は先にロースター削除を行ってください。"
      submitLabel="退会する"
    />
  )
}
