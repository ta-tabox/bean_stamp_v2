import { OfferStatus } from "@prisma/client"

export const DEVELOPMENT_PASSWORD = "password123"

export const developmentRoasters = [
  {
    address: "東京都渋谷区神南 1-1-1",
    describe: "フルーティーな浅煎り中心のサンプルロースターです。",
    image: "https://picsum.photos/seed/dev-roaster-light/512/512",
    name: "Light Roast Lab",
    phoneNumber: "03-1111-2222",
    prefectureCode: "13",
  },
  {
    address: "大阪府大阪市北区梅田 2-2-2",
    describe: "深煎りとブレンドを扱うサンプルロースターです。",
    image: "https://picsum.photos/seed/dev-roaster-deep/512/512",
    name: "Deep Roast Works",
    phoneNumber: "06-3333-4444",
    prefectureCode: "27",
  },
  {
    address: "神奈川県横浜市中区海岸通 3-3-3",
    describe: "甘さと質感を重視した中煎り中心のサンプルロースターです。",
    image: "https://picsum.photos/seed/dev-roaster-harbor/512/512",
    name: "Harbor Roast Club",
    phoneNumber: "045-555-1234",
    prefectureCode: "14",
  },
  {
    address: "福岡県福岡市中央区今泉 4-4-4",
    describe: "華やかなシングルオリジンを扱うサンプルロースターです。",
    image: "https://picsum.photos/seed/dev-roaster-bloom/512/512",
    name: "Bloom Coffee Atelier",
    phoneNumber: "092-777-8888",
    prefectureCode: "40",
  },
] as const

export const developmentUsers = [
  {
    describe: "ロースター未所属の動作確認用ユーザーです。",
    email: "user1@example.com",
    image: "https://picsum.photos/seed/dev-user-1/512/512",
    name: "Sample User 1",
    prefectureCode: "13",
    roasterName: null,
  },
  {
    describe: "フォローと検索確認用のユーザーです。",
    email: "user2@example.com",
    image: "https://picsum.photos/seed/dev-user-2/512/512",
    name: "Sample User 2",
    prefectureCode: "27",
    roasterName: null,
  },
  {
    describe: "おすすめ表示と Like 確認用のユーザーです。",
    email: "user3@example.com",
    image: "https://picsum.photos/seed/dev-user-3/512/512",
    name: "Sample User 3",
    prefectureCode: "14",
    roasterName: null,
  },
  {
    describe: "フォロー導線の確認用ユーザーです。",
    email: "follower@example.com",
    image: "https://picsum.photos/seed/dev-user-follower/512/512",
    name: "Sample Follower",
    prefectureCode: "14",
    roasterName: null,
  },
  {
    describe: "Light Roast Lab 所属の動作確認用アカウントです。",
    email: "roaster1@example.com",
    image: "https://picsum.photos/seed/dev-user-roaster-1/512/512",
    name: "Sample Roaster Owner 1",
    prefectureCode: "13",
    roasterName: "Light Roast Lab",
  },
  {
    describe: "Deep Roast Works 所属の動作確認用アカウントです。",
    email: "roaster2@example.com",
    image: "https://picsum.photos/seed/dev-user-roaster-2/512/512",
    name: "Sample Roaster Owner 2",
    prefectureCode: "27",
    roasterName: "Deep Roast Works",
  },
  {
    describe: "Harbor Roast Club 所属の動作確認用アカウントです。",
    email: "roaster3@example.com",
    image: "https://picsum.photos/seed/dev-user-roaster-3/512/512",
    name: "Sample Roaster Owner 3",
    prefectureCode: "14",
    roasterName: "Harbor Roast Club",
  },
  {
    describe: "Bloom Coffee Atelier 所属の動作確認用アカウントです。",
    email: "roaster4@example.com",
    image: "https://picsum.photos/seed/dev-user-roaster-4/512/512",
    name: "Sample Roaster Owner 4",
    prefectureCode: "40",
    roasterName: "Bloom Coffee Atelier",
  },
] as const

export const developmentFollows = [
  { followerEmail: "user1@example.com", roasterName: "Light Roast Lab" },
  { followerEmail: "user1@example.com", roasterName: "Deep Roast Works" },
  { followerEmail: "user1@example.com", roasterName: "Harbor Roast Club" },
  { followerEmail: "user2@example.com", roasterName: "Deep Roast Works" },
  { followerEmail: "user2@example.com", roasterName: "Bloom Coffee Atelier" },
  { followerEmail: "user3@example.com", roasterName: "Harbor Roast Club" },
  { followerEmail: "user3@example.com", roasterName: "Bloom Coffee Atelier" },
  { followerEmail: "follower@example.com", roasterName: "Light Roast Lab" },
  { followerEmail: "follower@example.com", roasterName: "Harbor Roast Club" },
] as const

export const developmentBeans = [
  {
    acidity: 4,
    bitterness: 2,
    body: 3,
    countryId: 44,
    describe: "みかんのような明るい酸と華やかさが出るサンプル豆です。",
    elevation: 1450,
    farm: "Okumino Farm",
    flavor: 4,
    image: "https://picsum.photos/seed/dev-bean-light/1200/900",
    name: "Shibuya Morning Blend",
    process: "Washed",
    roastLevelId: 2,
    roasterName: "Light Roast Lab",
    subregion: "Tokyo",
    sweetness: 4,
    tasteTagIds: [5, 24],
    variety: "Geisha",
  },
  {
    acidity: 5,
    bitterness: 1,
    body: 2,
    countryId: 5,
    describe: "ベリーとジャスミンを感じる華やかな浅煎りのサンプル豆です。",
    elevation: 1850,
    farm: "Guji Estate",
    flavor: 5,
    image: "https://picsum.photos/seed/dev-bean-guji/1200/900",
    name: "Guji Bloom",
    process: "Natural",
    roastLevelId: 1,
    roasterName: "Light Roast Lab",
    subregion: "Guji",
    sweetness: 4,
    tasteTagIds: [5, 9],
    variety: "74110",
  },
  {
    acidity: 2,
    bitterness: 4,
    body: 4,
    countryId: 3,
    describe: "チョコレート感の強い深煎りブレンドのサンプル豆です。",
    elevation: 1250,
    farm: "Medellin Estate",
    flavor: 3,
    image: "https://picsum.photos/seed/dev-bean-deep/1200/900",
    name: "Umeda Night Blend",
    process: "Natural",
    roastLevelId: 5,
    roasterName: "Deep Roast Works",
    subregion: "Antioquia",
    sweetness: 3,
    tasteTagIds: [61, 66],
    variety: "Caturra",
  },
  {
    acidity: 3,
    bitterness: 5,
    body: 5,
    countryId: 1,
    describe: "ナッツとカカオ感の強いエスプレッソ向けサンプル豆です。",
    elevation: 1100,
    farm: "Cerrado Farm",
    flavor: 2,
    image: "https://picsum.photos/seed/dev-bean-espresso/1200/900",
    name: "Osaka Espresso Blend",
    process: "Pulped Natural",
    roastLevelId: 5,
    roasterName: "Deep Roast Works",
    subregion: "Cerrado",
    sweetness: 3,
    tasteTagIds: [58, 61],
    variety: "Mundo Novo",
  },
  {
    acidity: 3,
    bitterness: 2,
    body: 4,
    countryId: 19,
    describe: "黒糖のような甘さと厚みを感じるサンプル豆です。",
    elevation: 1750,
    farm: "Nyeri Hills",
    flavor: 4,
    image: "https://picsum.photos/seed/dev-bean-harbor/1200/900",
    name: "Harbor City Roast",
    process: "Washed",
    roastLevelId: 3,
    roasterName: "Harbor Roast Club",
    subregion: "Nyeri",
    sweetness: 5,
    tasteTagIds: [24, 67],
    variety: "SL28",
  },
  {
    acidity: 4,
    bitterness: 2,
    body: 3,
    countryId: 35,
    describe: "パナマらしいフローラル感を楽しめるサンプル豆です。",
    elevation: 1600,
    farm: "Canal Farm",
    flavor: 5,
    image: "https://picsum.photos/seed/dev-bean-canal/1200/900",
    name: "Canal Sunset",
    process: "Honey",
    roastLevelId: 2,
    roasterName: "Harbor Roast Club",
    subregion: "Boquete",
    sweetness: 4,
    tasteTagIds: [1, 23],
    variety: "Catuai",
  },
  {
    acidity: 5,
    bitterness: 1,
    body: 2,
    countryId: 44,
    describe: "紅茶のような透明感があるサンプル豆です。",
    elevation: 900,
    farm: "Itoshima Farm",
    flavor: 4,
    image: "https://picsum.photos/seed/dev-bean-bloom/1200/900",
    name: "Bloom Seasonal",
    process: "Washed",
    roastLevelId: 2,
    roasterName: "Bloom Coffee Atelier",
    subregion: "Fukuoka",
    sweetness: 4,
    tasteTagIds: [2, 24],
    variety: "Bourbon",
  },
  {
    acidity: 4,
    bitterness: 1,
    body: 3,
    countryId: 14,
    describe: "柑橘とハニーを感じる季節限定サンプル豆です。",
    elevation: 1500,
    farm: "Tarrazu Reserve",
    flavor: 4,
    image: "https://picsum.photos/seed/dev-bean-honey/1200/900",
    name: "Atelier Honey Drop",
    process: "Honey",
    roastLevelId: 2,
    roasterName: "Bloom Coffee Atelier",
    subregion: "Tarrazu",
    sweetness: 5,
    tasteTagIds: [24, 67],
    variety: "Villa Sarchi",
  },
] as const

export const developmentOffers = [
  {
    amount: 8,
    beanName: "Shibuya Morning Blend",
    code: "offer-light-on-offering",
    price: 1850,
    schedulePreset: "on_offering",
    weight: 100,
  },
  {
    amount: 10,
    beanName: "Guji Bloom",
    code: "offer-light-on-roasting",
    price: 1980,
    schedulePreset: "on_roasting",
    weight: 120,
  },
  {
    amount: 12,
    beanName: "Umeda Night Blend",
    code: "offer-deep-on-preparing",
    price: 2100,
    schedulePreset: "on_preparing",
    weight: 200,
  },
  {
    amount: 6,
    beanName: "Osaka Espresso Blend",
    code: "offer-deep-on-selling",
    price: 1680,
    schedulePreset: "on_selling",
    weight: 150,
  },
  {
    amount: 5,
    beanName: "Harbor City Roast",
    code: "offer-harbor-end-of-sales",
    price: 2300,
    schedulePreset: "end_of_sales",
    weight: 180,
  },
  {
    amount: 9,
    beanName: "Canal Sunset",
    code: "offer-harbor-on-offering",
    price: 2400,
    schedulePreset: "on_offering",
    weight: 150,
  },
  {
    amount: 7,
    beanName: "Bloom Seasonal",
    code: "offer-bloom-on-roasting",
    price: 1750,
    schedulePreset: "on_roasting",
    weight: 100,
  },
  {
    amount: 11,
    beanName: "Atelier Honey Drop",
    code: "offer-bloom-on-preparing",
    price: 1920,
    schedulePreset: "on_preparing",
    weight: 130,
  },
  {
    amount: 4,
    beanName: "Shibuya Morning Blend",
    code: "offer-light-on-selling",
    price: 2550,
    schedulePreset: "on_selling",
    weight: 300,
  },
  {
    amount: 3,
    beanName: "Bloom Seasonal",
    code: "offer-bloom-end-of-sales",
    price: 1450,
    schedulePreset: "end_of_sales",
    weight: 80,
  },
] as const

export const developmentLikes = [
  { offerCode: "offer-light-on-offering", userEmail: "user1@example.com" },
  { offerCode: "offer-harbor-on-offering", userEmail: "user1@example.com" },
  { offerCode: "offer-deep-on-selling", userEmail: "user2@example.com" },
  { offerCode: "offer-bloom-on-roasting", userEmail: "user3@example.com" },
] as const

export const developmentWants = [
  { offerCode: "offer-light-on-offering", userEmail: "user1@example.com" },
  { offerCode: "offer-deep-on-selling", userEmail: "user1@example.com" },
  { offerCode: "offer-harbor-on-offering", userEmail: "user3@example.com" },
  { offerCode: "offer-bloom-on-preparing", userEmail: "follower@example.com" },
] as const

export type OfferSchedulePreset =
  | "on_offering"
  | "on_roasting"
  | "on_preparing"
  | "on_selling"
  | "end_of_sales"

export type DevelopmentOfferSeed = (typeof developmentOffers)[number]

export function buildOfferScheduleFromSeedDate(seedDate: Date, preset: OfferSchedulePreset) {
  const baseDate = startOfUtcDay(seedDate)

  switch (preset) {
    case "on_offering":
      return {
        endedAt: addDays(baseDate, 2),
        receiptEndedAt: addDays(baseDate, 8),
        receiptStartedAt: addDays(baseDate, 6),
        roastedAt: addDays(baseDate, 4),
      }
    case "on_roasting":
      return {
        endedAt: addDays(baseDate, -1),
        receiptEndedAt: addDays(baseDate, 5),
        receiptStartedAt: addDays(baseDate, 3),
        roastedAt: addDays(baseDate, 1),
      }
    case "on_preparing":
      return {
        endedAt: addDays(baseDate, -3),
        receiptEndedAt: addDays(baseDate, 4),
        receiptStartedAt: addDays(baseDate, 2),
        roastedAt: addDays(baseDate, -1),
      }
    case "on_selling":
      return {
        endedAt: addDays(baseDate, -5),
        receiptEndedAt: addDays(baseDate, 2),
        receiptStartedAt: addDays(baseDate, -1),
        roastedAt: addDays(baseDate, -3),
      }
    case "end_of_sales":
      return {
        endedAt: addDays(baseDate, -8),
        receiptEndedAt: addDays(baseDate, -1),
        receiptStartedAt: addDays(baseDate, -4),
        roastedAt: addDays(baseDate, -6),
      }
  }
}

export function summarizeOfferStatuses(seedDate: Date) {
  return developmentOffers.reduce<Record<OfferSchedulePreset, number>>(
    (accumulator, offer) => {
      const schedule = buildOfferScheduleFromSeedDate(seedDate, offer.schedulePreset)
      const status = resolveOfferStatusFromSchedule(seedDate, schedule)

      accumulator[status] += 1

      return accumulator
    },
    {
      end_of_sales: 0,
      on_offering: 0,
      on_preparing: 0,
      on_roasting: 0,
      on_selling: 0,
    },
  )
}

function resolveOfferStatusFromSchedule(
  now: Date,
  schedule: {
    endedAt: Date
    receiptEndedAt: Date
    receiptStartedAt: Date
    roastedAt: Date
  },
): OfferSchedulePreset {
  const today = startOfUtcDay(now)

  if (today <= endOfUtcDay(schedule.endedAt)) {
    return OfferStatus.on_offering
  }

  if (today <= endOfUtcDay(schedule.roastedAt)) {
    return OfferStatus.on_roasting
  }

  if (today < startOfUtcDay(schedule.receiptStartedAt)) {
    return OfferStatus.on_preparing
  }

  if (today <= endOfUtcDay(schedule.receiptEndedAt)) {
    return OfferStatus.on_selling
  }

  return OfferStatus.end_of_sales
}

function addDays(value: Date, days: number) {
  const next = new Date(value)

  next.setUTCDate(next.getUTCDate() + days)

  return next
}

function startOfUtcDay(value: Date) {
  return new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()))
}

function endOfUtcDay(value: Date) {
  return new Date(
    Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate(), 23, 59, 59, 999),
  )
}
