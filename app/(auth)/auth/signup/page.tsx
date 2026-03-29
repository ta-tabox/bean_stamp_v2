import { PlaceholderPage } from "@/components/shared/placeholder-page";
import { authRoutes } from "@/features/auth";

export default function SignUpPage() {
  return (
    <PlaceholderPage
      eyebrow="Auth"
      title="Sign up"
      description="新規登録フローの移行先です。入力フォームとバリデーションは後続 issue で実装します。"
      links={authRoutes}
    />
  );
}
