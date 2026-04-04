import { UserProfilePageContent } from "@/features/profiles/components/ProfilePageContents"
import { getSessionPrincipal } from "@/server/auth/guards"
import { getUserProfile } from "@/server/profiles/service"

type UserPageProps = Readonly<{
  params: Promise<{ id: string }>
  searchParams?: Promise<{ updated?: string }>
}>

export default async function UserPage({ params, searchParams }: UserPageProps) {
  const { id } = await params
  const currentUser = await getSessionPrincipal()
  const user = await getUserProfile(id)
  const search = (await searchParams) ?? {}

  return (
    <UserProfilePageContent
      canEdit={currentUser?.id === id}
      status={{ updated: search.updated === "1" }}
      user={user}
    />
  )
}
