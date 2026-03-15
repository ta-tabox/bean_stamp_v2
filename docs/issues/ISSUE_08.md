# [Issue 08] Offers 機能（CRUD + ステータス + wanted_users）

## 目的

オファーの主要機能とステータス計算、ウォントユーザー一覧を再実装する。

## 参照リソース

- `docs/migration-resources/api-spec/controllers-v1/offers_controller.rb`
- `docs/migration-resources/api-spec/views-api/v1/offers`
- `docs/migration-resources/frontend-src/features/offers`
- `docs/migration-resources/db/schema.rb`

## 実装タスク

- [ ] Offers 一覧/詳細/作成/更新/削除 API
- [ ] 日付系バリデーション（ended/roasted/receipt started/receipt ended）
- [ ] ステータス計算ロジック実装
- [ ] `offers/:id/wanted_users` API実装
- [ ] `offers/stats` API実装
- [ ] Offers関連画面移植

## 受け入れ条件（DoD）

- [ ] Offerの作成〜削除まで一連動作する
- [ ] ステータス表示が旧仕様と整合
- [ ] wanted_users 一覧が表示される

## 依存

- Issue 07
