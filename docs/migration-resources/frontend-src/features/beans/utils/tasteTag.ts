import { capitalize } from '@/utils/capitalize'

type TasteTag = {
  id: number
  name: string
  tasteGroupId: number
}

// Selectメニューのprefectureオプションの型
export type TasteTagOption = {
  label: string
  value: number
}

/**
 * tasteTag一覧
 */
const tasteTags: TasteTag[] = [
  { id: 1, name: 'floral', tasteGroupId: 1 },
  { id: 2, name: 'black tea', tasteGroupId: 1 },
  { id: 3, name: 'chamomile', tasteGroupId: 1 },
  { id: 4, name: 'rose', tasteGroupId: 1 },
  { id: 5, name: 'jasmine', tasteGroupId: 1 },
  { id: 6, name: 'berry', tasteGroupId: 6 },
  { id: 7, name: 'blackberry', tasteGroupId: 6 },
  { id: 8, name: 'raspberry', tasteGroupId: 6 },
  { id: 9, name: 'blueberry', tasteGroupId: 6 },
  { id: 10, name: 'strawberry', tasteGroupId: 6 },
  { id: 11, name: 'dried fruit', tasteGroupId: 11 },
  { id: 12, name: 'raisin', tasteGroupId: 11 },
  { id: 13, name: 'prune', tasteGroupId: 11 },
  { id: 14, name: 'fruit', tasteGroupId: 14 },
  { id: 15, name: 'coconut', tasteGroupId: 14 },
  { id: 16, name: 'cherry', tasteGroupId: 14 },
  { id: 17, name: 'pineapple', tasteGroupId: 14 },
  { id: 18, name: 'grape', tasteGroupId: 14 },
  { id: 19, name: 'apple', tasteGroupId: 14 },
  { id: 20, name: 'peach', tasteGroupId: 14 },
  { id: 21, name: 'pear', tasteGroupId: 14 },
  { id: 22, name: 'citrus', tasteGroupId: 22 },
  { id: 23, name: 'grapefruit', tasteGroupId: 22 },
  { id: 24, name: 'orange', tasteGroupId: 22 },
  { id: 25, name: 'lemon', tasteGroupId: 22 },
  { id: 26, name: 'lime', tasteGroupId: 22 },
  { id: 27, name: 'fermented', tasteGroupId: 27 },
  { id: 28, name: 'winey', tasteGroupId: 27 },
  { id: 29, name: 'whiskey', tasteGroupId: 27 },
  { id: 30, name: 'green', tasteGroupId: 30 },
  { id: 31, name: 'olive oil', tasteGroupId: 30 },
  { id: 32, name: 'peapod', tasteGroupId: 30 },
  { id: 33, name: 'fresh', tasteGroupId: 30 },
  { id: 34, name: 'dark green', tasteGroupId: 30 },
  { id: 35, name: 'vegetable', tasteGroupId: 30 },
  { id: 36, name: 'hay-like', tasteGroupId: 30 },
  { id: 37, name: 'herb-like', tasteGroupId: 30 },
  { id: 38, name: 'beany', tasteGroupId: 30 },
  { id: 39, name: 'earthy', tasteGroupId: 39 },
  { id: 40, name: 'woody', tasteGroupId: 39 },
  { id: 41, name: 'roasted', tasteGroupId: 41 },
  { id: 42, name: 'pipe tobacco', tasteGroupId: 41 },
  { id: 43, name: 'tobacco', tasteGroupId: 41 },
  { id: 44, name: 'burnt', tasteGroupId: 41 },
  { id: 45, name: 'smoky', tasteGroupId: 41 },
  { id: 46, name: 'cereal', tasteGroupId: 46 },
  { id: 47, name: 'grain', tasteGroupId: 46 },
  { id: 48, name: 'malt', tasteGroupId: 46 },
  { id: 49, name: 'spice', tasteGroupId: 49 },
  { id: 50, name: 'pungent', tasteGroupId: 49 },
  { id: 51, name: 'pepper', tasteGroupId: 49 },
  { id: 52, name: 'anise', tasteGroupId: 49 },
  { id: 53, name: 'nutmeg', tasteGroupId: 49 },
  { id: 54, name: 'cinnamon', tasteGroupId: 49 },
  { id: 55, name: 'clove', tasteGroupId: 49 },
  { id: 56, name: 'nutty', tasteGroupId: 56 },
  { id: 57, name: 'peanuts', tasteGroupId: 56 },
  { id: 58, name: 'hazelnut', tasteGroupId: 56 },
  { id: 59, name: 'almond', tasteGroupId: 56 },
  { id: 60, name: 'cocoa', tasteGroupId: 60 },
  { id: 61, name: 'chocolate', tasteGroupId: 60 },
  { id: 62, name: 'dark chocolate', tasteGroupId: 60 },
  { id: 63, name: 'brown sugar', tasteGroupId: 63 },
  { id: 64, name: 'molasses', tasteGroupId: 63 },
  { id: 65, name: 'maple syrup', tasteGroupId: 63 },
  { id: 66, name: 'caramel', tasteGroupId: 63 },
  { id: 67, name: 'honey', tasteGroupId: 63 },
  { id: 68, name: 'sweet', tasteGroupId: 68 },
  { id: 69, name: 'vanilla', tasteGroupId: 68 },
  { id: 70, name: 'sweet aromatics', tasteGroupId: 68 },
]

// tasteTagsからreact-selectで取り扱うoptionの形に変換
const convertToOption = (tasteTag: TasteTag): TasteTagOption => ({
  label: capitalize(tasteTag.name),
  value: tasteTag.id,
})

export const tasteTagOptions = tasteTags.map(convertToOption)
