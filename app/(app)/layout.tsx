import type { ReactNode } from "react";

import { appRoutes } from "@/features/app";
import { SectionLayout } from "@/components/layout/section-layout";

type AppLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <SectionLayout
      badge="App"
      title="認証後アプリ"
      description="将来的にはセッション必須レイアウトに置き換え、`redirect()` ベースのサーバーサイドガードをここで適用します。"
      links={appRoutes}
    >
      {children}
    </SectionLayout>
  );
}
