import { PlaceholderPage } from "@/components/shared/placeholder-page";
import { offersRoutes } from "@/features/offers";

type OfferPageProps = Readonly<{
  params: Promise<{ id: string }>;
}>;

export default async function OfferPage({ params }: OfferPageProps) {
  const { id } = await params;

  return (
    <PlaceholderPage
      eyebrow="Offers"
      title={`オファー詳細 #${id}`}
      description="公開中オファーの詳細画面です。"
      links={offersRoutes}
    />
  );
}
