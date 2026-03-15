# [Issue 07] Beans 機能（CRUD + 画像 + 風味タグ）

## 目的

コーヒー豆（Beans）の登録・編集・削除・表示を旧仕様相当で再現する。

## 参照リソース

- `docs/migration-resources/api-spec/controllers-v1/beans_controller.rb`
- `docs/migration-resources/api-spec/views-api/v1/beans`
- `docs/migration-resources/frontend-src/features/beans`
- `docs/migration-resources/frontend-src/features/beans/utils`
- `docs/migration-resources/db/schema.rb`

## 実装タスク

- [ ] Beans 一覧/詳細/作成/更新/削除 API
- [ ] 画像アップロード（複数枚）
- [ ] 風味タグ2〜3件バリデーション
- [ ] 画像枚数バリデーション
- [ ] フロントフォーム移植（create/update）

## 受け入れ条件（DoD）

- [ ] Bean作成から詳細表示まで動作
- [ ] バリデーションエラーがUIで表示される

## 依存

- Issue 06
