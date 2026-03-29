import { PlaceholderPage } from "@/components/shared/placeholder-page"
import { authRoutes } from "@/features/auth"

export default function PasswordResetPage() {
  return (
    <PlaceholderPage
      eyebrow="Auth"
      title="Password reset"
      description="パスワード再設定フローの受け皿です。メール送信やトークン検証は後続 issue で追加します。"
      links={authRoutes}
    />
  )
}
