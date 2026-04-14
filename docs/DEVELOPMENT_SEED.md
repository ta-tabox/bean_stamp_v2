# 開発用 Seed データ

このドキュメントは `docker compose exec app pnpm prisma:seed:dev` で投入される開発確認用データをまとめたもの。

## 実行コマンド

```bash
docker compose exec app pnpm prisma:seed:dev
```

`prisma:seed:dev` は次を投入する。

- マスターデータ
- 開発確認用のロースター
- 開発確認用のユーザー
- フォロー関係
- ブラウザ確認用の豆
- ブラウザ確認用のオファー
- おすすめ表示確認用の Like / Want

## ログイン情報

共通パスワード:

```txt
password123
```

アカウント一覧:

- `user1@example.com`
  - ロースター未所属
  - `Light Roast Lab` / `Deep Roast Works` / `Harbor Roast Club` をフォロー済み
- `user2@example.com`
  - ロースター未所属
  - `Deep Roast Works` / `Bloom Coffee Atelier` をフォロー済み
- `user3@example.com`
  - ロースター未所属
  - `Harbor Roast Club` / `Bloom Coffee Atelier` をフォロー済み
- `follower@example.com`
  - ロースター未所属
  - `Light Roast Lab` / `Harbor Roast Club` をフォロー済み
- `roaster1@example.com`
  - `Light Roast Lab` 所属
- `roaster2@example.com`
  - `Deep Roast Works` 所属
- `roaster3@example.com`
  - `Harbor Roast Club` 所属
- `roaster4@example.com`
  - `Bloom Coffee Atelier` 所属

## ロースター

- `Light Roast Lab`
  - 東京都渋谷区神南 1-1-1
  - フルーティーな浅煎り中心のサンプルロースター
- `Deep Roast Works`
  - 大阪府大阪市北区梅田 2-2-2
  - 深煎りとブレンド中心のサンプルロースター
- `Harbor Roast Club`
  - 神奈川県横浜市中区海岸通 3-3-3
  - 甘さと質感を重視した中煎り中心のサンプルロースター
- `Bloom Coffee Atelier`
  - 福岡県福岡市中央区今泉 4-4-4
  - 華やかなシングルオリジン中心のサンプルロースター

## 豆

- `Shibuya Morning Blend`
  - ロースター: `Light Roast Lab`
  - 風味タグ: `jasmine`, `orange`
  - 画像あり
- `Guji Bloom`
  - ロースター: `Light Roast Lab`
  - 風味タグ: `jasmine`, `blueberry`
  - 画像あり
- `Umeda Night Blend`
  - ロースター: `Deep Roast Works`
  - 風味タグ: `chocolate`, `caramel`
  - 画像あり
- `Osaka Espresso Blend`
  - ロースター: `Deep Roast Works`
  - 風味タグ: `hazelnut`, `chocolate`
  - 画像あり
- `Harbor City Roast`
  - ロースター: `Harbor Roast Club`
  - 風味タグ: `orange`, `honey`
  - 画像あり
- `Canal Sunset`
  - ロースター: `Harbor Roast Club`
  - 風味タグ: `floral`, `grapefruit`
  - 画像あり
- `Bloom Seasonal`
  - ロースター: `Bloom Coffee Atelier`
  - 風味タグ: `black tea`, `orange`
  - 画像あり
- `Atelier Honey Drop`
  - ロースター: `Bloom Coffee Atelier`
  - 風味タグ: `orange`, `honey`
  - 画像あり

## オファー

seed 実行日の当日を基準に、10 件のオファーを投入または更新する。
日付は毎回 seed 実行日基準で再計算されるため、いつ投入しても各ステータスが揃う。

ステータス内訳:

- `on_offering`: 2 件
- `on_roasting`: 2 件
- `on_preparing`: 2 件
- `on_selling`: 2 件
- `end_of_sales`: 2 件

主なオファー例:

- `Shibuya Morning Blend 100g`
  - 豆: `Shibuya Morning Blend`
  - 価格: `1850円`
  - 内容量: `100g`
  - 数量: `8`
  - ステータス: `on_offering`
  - オファー終了日: 当日 + 2 日
  - 焙煎日: 当日 + 4 日
  - 受け取り開始日: 当日 + 6 日
  - 受け取り終了日: 当日 + 8 日
- `Guji Bloom 120g`
  - 豆: `Guji Bloom`
  - 価格: `1980円`
  - 内容量: `120g`
  - 数量: `10`
  - ステータス: `on_roasting`
  - オファー終了日: 当日 - 1 日
  - 焙煎日: 当日 + 1 日
  - 受け取り開始日: 当日 + 3 日
  - 受け取り終了日: 当日 + 5 日
- `Umeda Night Blend 200g`
  - 豆: `Umeda Night Blend`
  - 価格: `2100円`
  - 内容量: `200g`
  - 数量: `12`
  - ステータス: `on_preparing`
  - オファー終了日: 当日 - 3 日
  - 焙煎日: 当日 - 1 日
  - 受け取り開始日: 当日 + 2 日
  - 受け取り終了日: 当日 + 4 日
- `Osaka Espresso Blend 150g`
  - 豆: `Osaka Espresso Blend`
  - 価格: `1680円`
  - 内容量: `150g`
  - 数量: `6`
  - ステータス: `on_selling`
  - オファー終了日: 当日 - 5 日
  - 焙煎日: 当日 - 3 日
  - 受け取り開始日: 当日 - 1 日
  - 受け取り終了日: 当日 + 2 日
- `Harbor City Roast 180g`
  - 豆: `Harbor City Roast`
  - 価格: `2300円`
  - 内容量: `180g`
  - 数量: `5`
  - ステータス: `end_of_sales`
  - オファー終了日: 当日 - 8 日
  - 焙煎日: 当日 - 6 日
  - 受け取り開始日: 当日 - 4 日
  - 受け取り終了日: 当日 - 1 日

おすすめ確認用の関連データ:

- `user1@example.com`
  - Like: `Shibuya Morning Blend 100g`, `Canal Sunset 150g`
  - Want: `Shibuya Morning Blend 100g`, `Osaka Espresso Blend 150g`
- `user3@example.com`
  - Like: `Bloom Seasonal 100g`
  - Want: `Canal Sunset 150g`

## 主な確認用途

- `user1@example.com`
  - ユーザーホームでオファー一覧を確認
  - `Wants` / `Likes` / おすすめ表示を確認
- `user2@example.com`
  - 検索、フォロー、一覧導線を確認
- `user3@example.com`
  - おすすめ表示、Harbor / Bloom 系オファーの導線を確認
- `follower@example.com`
  - フォロー済みロースターのオファー受け取り動線を確認
- `roaster1@example.com`
  - `Light Roast Lab` の豆とオファー編集を確認
- `roaster2@example.com`
  - `Deep Roast Works` の豆とオファー編集を確認
- `roaster3@example.com`
  - `Harbor Roast Club` の一覧とステータス別オファー確認
- `roaster4@example.com`
  - `Bloom Coffee Atelier` の一覧とステータス別オファー確認

## 更新ルール

- 同名ロースター、同名ユーザーは既存データを更新する
- 同名の豆は既存データを更新する
- オファーは `beanId + price + weight + amount` が一致する既存レコードを更新し、なければ新規作成する
- Like / Want は `userId + offerId` が一致する既存レコードを再利用する
- 日付は seed 実行日を基準に毎回再計算する
