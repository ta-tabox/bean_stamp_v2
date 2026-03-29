import { PlaceholderPage } from "@/components/shared/placeholder-page";
import { authRoutes } from "@/features/auth";

export default function SignInPage() {
  return (
    <PlaceholderPage
      eyebrow="Auth"
      title="Sign in"
      description="Auth.js 導入時のサインイン画面です。現在はルーティング骨組みだけを確定しています。"
      links={authRoutes}
    />
  );
}
