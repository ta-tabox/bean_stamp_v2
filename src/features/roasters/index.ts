export function buildRoastersRoutes(roasterId?: string | null) {
  const baseRoutes = [
    { href: "/roasters/home", label: "ロースターホーム" },
    { href: "/roasters/new", label: "新規作成" },
    { href: "/roasters/edit", label: "ロースター編集" },
    { href: "/roasters/cancel", label: "ロースター削除" },
  ] as const

  if (!roasterId) {
    return baseRoutes
  }

  return [
    ...baseRoutes,
    {
      href: `/roasters/${roasterId}`,
      label: "ロースター詳細",
    },
    {
      href: `/roasters/${roasterId}/follower`,
      label: "フォロワー一覧",
    },
  ] as const
}
