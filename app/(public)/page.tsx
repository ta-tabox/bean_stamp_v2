import { redirect } from "next/navigation"

import { PublicHomePageContent } from "@/features/public/components/PublicPageContents"
import { getSessionPrincipal } from "@/server/auth/guards"

export default async function PublicHomePage() {
  const session = await getSessionPrincipal()

  if (session) {
    redirect("/users/home")
  }

  return <PublicHomePageContent />
}
