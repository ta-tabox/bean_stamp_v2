import { PlaceholderPage } from "@/components/shared/placeholder-page";
import { roastersRoutes } from "@/features/roasters";

export default function RoastersHomePage() {
  return (
    <PlaceholderPage
      eyebrow="Roasters"
      title="ロースターホーム"
      description="所属ロースター向けのダッシュボード配置を想定したルートです。"
      links={roastersRoutes}
    />
  );
}
