export function buildRoastersRoutes(roasterId?: string | null) {
  return [
    { href: "/roasters/home", label: "ロースターホーム" },
    { href: "/roasters/new", label: "新規作成" },
    { href: "/roasters/edit", label: "ロースター編集" },
    { href: "/roasters/cancel", label: "ロースター削除" },
    {
      href: roasterId ? `/roasters/${roasterId}` : "/roasters/new",
      label: "ロースター詳細",
    },
    {
      href: roasterId ? `/roasters/${roasterId}/follower` : "/roasters/new",
      label: "フォロワー一覧",
    },
  ] as const
}
