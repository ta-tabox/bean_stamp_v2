import { PlaceholderPage } from "@/components/shared/placeholder-page";
import { usersRoutes } from "@/features/users";

type UserPageProps = Readonly<{
  params: Promise<{ id: string }>;
}>;

export default async function UserPage({ params }: UserPageProps) {
  const { id } = await params;

  return (
    <PlaceholderPage
      eyebrow="Users"
      title={`ユーザー詳細 #${id}`}
      description="動的ユーザー詳細ページです。SSR でユーザー DTO を読み込む前提で用意しています。"
      links={usersRoutes}
    />
  );
}
