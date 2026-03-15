type RoastLevel = {
  id: number
  name: string
}

// Selectメニューのprefectureオプションの型
export type RoastLevelOption = {
  label: string
  value: number
}

/**
 * ローストレベル一覧
 */
const roastLevels: RoastLevel[] = [
  { id: 1, name: '浅煎り' },
  { id: 2, name: '中浅煎り' },
  { id: 3, name: '中煎り' },
  { id: 4, name: '中深煎り' },
  { id: 5, name: '深煎り' },
]

// countryArrayからreact-selectで取り扱うoptionの形に変換
const convertToOption = (roastLevel: RoastLevel): RoastLevelOption => ({
  label: roastLevel.name,
  value: roastLevel.id,
})

export const roastLevelOptions = roastLevels.map(convertToOption)
