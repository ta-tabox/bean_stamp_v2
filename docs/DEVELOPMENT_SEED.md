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

## ログイン情報

共通パスワード:

```txt
password123
```

アカウント一覧:

- `user1@example.com`
  - ロースター未所属
  - `Light Roast Lab` と `Deep Roast Works` をフォロー済み
- `follower@example.com`
  - ロースター未所属
  - `Light Roast Lab` をフォロー済み
- `roaster1@example.com`
  - `Light Roast Lab` 所属
- `roaster2@example.com`
  - `Deep Roast Works` 所属

## ロースター

- `Light Roast Lab`
  - 東京都渋谷区神南 1-1-1
  - フルーティーな浅煎り中心のサンプルロースター
- `Deep Roast Works`
  - 大阪府大阪市北区梅田 2-2-2
  - 深煎りとブレンド中心のサンプルロースター

## 豆

- `Shibuya Morning Blend`
  - ロースター: `Light Roast Lab`
  - 風味タグ: `jasmine`, `orange`
  - 画像あり
- `Umeda Night Blend`
  - ロースター: `Deep Roast Works`
  - 風味タグ: `chocolate`, `caramel`
  - 画像あり

## オファー

seed 実行日の当日を基準に、次の 2 件のオファーを投入または更新する。

- `Shibuya Morning Blend 100g`
  - 豆: `Shibuya Morning Blend`
  - 価格: `1850円`
  - 内容量: `100g`
  - 数量: `8`
  - オファー終了日: 当日 + 2 日
  - 焙煎日: 当日 + 3 日
  - 受け取り開始日: 当日 + 5 日
  - 受け取り終了日: 当日 + 6 日
- `Umeda Night Blend 200g`
  - 豆: `Umeda Night Blend`
  - 価格: `2100円`
  - 内容量: `200g`
  - 数量: `12`
  - オファー終了日: 当日 + 1 日
  - 焙煎日: 当日 + 2 日
  - 受け取り開始日: 当日 + 4 日
  - 受け取り終了日: 当日 + 5 日

## 主な確認用途

- `user1@example.com`
  - ユーザーホームでオファー一覧を確認
  - `Wants` / `Likes` の導線を確認
- `follower@example.com`
  - フォロー済みロースターのオファー受け取り動線を確認
- `roaster1@example.com`
  - `Light Roast Lab` の豆とオファー編集を確認
- `roaster2@example.com`
  - `Deep Roast Works` の豆とオファー編集を確認

## 更新ルール

- 同名ロースター、同名ユーザーは既存データを更新する
- 同名の豆は既存データを更新する
- オファーは `beanId + price + weight + amount` が一致する既存レコードを更新し、なければ新規作成する
- 日付は seed 実行日を基準に毎回再計算する
