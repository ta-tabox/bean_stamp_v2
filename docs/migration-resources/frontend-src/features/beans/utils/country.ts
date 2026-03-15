type Country = {
  id: number
  name: string
  area: string
}

// Selectメニューのprefectureオプションの型
export type CountryOption = {
  label: string
  value: number
}

/**
 * 生産国一覧
 */
const countries: Country[] = [
  { id: 1, name: 'ブラジル', area: 'Latin America' },
  { id: 2, name: 'ベトナム', area: 'Asia' },
  { id: 3, name: 'コロンビア', area: 'Latin America' },
  { id: 4, name: 'インドネシア', area: 'Asia' },
  { id: 5, name: 'エチオピア', area: 'Africa' },
  { id: 6, name: 'インド', area: 'Asia' },
  { id: 7, name: 'ホンジュラス', area: 'Latin America' },
  { id: 8, name: 'ペルー', area: 'Latin America' },
  { id: 9, name: 'ウガンダ', area: 'Africa' },
  { id: 10, name: 'メキシコ', area: 'Latin America' },
  { id: 11, name: 'グアテマラ', area: 'Latin America' },
  { id: 12, name: 'コートジボワール', area: 'Africa' },
  { id: 13, name: 'マレーシア', area: 'Asia' },
  { id: 14, name: 'コスタリカ', area: 'Latin America' },
  { id: 15, name: 'ニカラグア', area: 'Latin America' },
  { id: 16, name: 'タンザニア', area: 'Africa' },
  { id: 17, name: 'タイ', area: 'Asia' },
  { id: 18, name: 'パプアニューギニア', area: 'Oceania' },
  { id: 19, name: 'ケニア', area: 'Africa' },
  { id: 20, name: 'エルサルバドル', area: 'Latin America' },
  { id: 21, name: 'ベネズエラ', area: 'Latin America' },
  { id: 22, name: 'マダガスカル', area: 'Africa' },
  { id: 23, name: 'カメルーン', area: 'Africa' },
  { id: 24, name: 'フィリピン', area: 'Asia' },
  { id: 25, name: 'ラオス', area: 'Asia' },
  { id: 26, name: 'エクアドル', area: 'Latin America' },
  { id: 27, name: 'ドミニカ共和高', area: 'Latin America' },
  { id: 28, name: 'ハイチ', area: 'Latin America' },
  { id: 29, name: 'ルワンダ', area: 'Africa' },
  { id: 30, name: 'コンゴ民主共和国', area: 'Africa' },
  { id: 31, name: 'ブルンジ', area: 'Africa' },
  { id: 32, name: 'イエメン', area: 'Asia' },
  { id: 33, name: 'ボリビア', area: 'Latin America' },
  { id: 34, name: 'キューバ', area: 'Latin America' },
  { id: 35, name: 'パナマ', area: 'Latin America' },
  { id: 36, name: 'アメリカ(ハワイ)', area: 'Oceania' },
  { id: 37, name: 'ニカラグア', area: 'Latin America' },
  { id: 38, name: 'マラウェイ', area: 'Africa' },
  { id: 39, name: 'ジャマイカ', area: 'Latin America' },
  { id: 40, name: 'オーストラリア', area: 'Oceania' },
  { id: 41, name: '中国', area: 'Asia' },
  { id: 42, name: '東ティモール', area: 'Asia' },
  { id: 43, name: 'ネパール', area: 'Asia' },
  { id: 44, name: '日本', area: 'Asia' },
]

// countryArrayからreact-selectで取り扱うoptionの形に変換
const convertToOption = (country: Country): CountryOption => ({
  label: country.name,
  value: country.id,
})

export const countryOptions = countries.map(convertToOption)
