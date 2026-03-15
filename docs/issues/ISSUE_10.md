# [Issue 10] Search / Recommend 機能

## 目的

ロースター検索・オファー検索・レコメンドを旧仕様相当で再実装する。

## 参照リソース

- `docs/migration-resources/api-spec/controllers-v1/search_controller.rb`
- `docs/migration-resources/api-spec/controllers-v1/offers_controller.rb`（recommend）
- `docs/migration-resources/api-spec/views-api/v1/offers`
- `docs/migration-resources/api-spec/views-api/v1/roasters`
- `docs/migration-resources/frontend-src/features/search`
- `docs/migration-resources/frontend-src/features/offers/hooks`
- `docs/migration-resources/frontend-src/features/beans/utils/tasteTag.ts`

## 実装タスク

- [ ] `search/roasters` API実装
- [ ] `search/offers` API実装
- [ ] `offers/recommend` API実装
- [ ] 味覚グループ集計ロジック移植
- [ ] 検索フォーム/検索結果UI移植

## 受け入れ条件（DoD）

- [ ] 条件付き検索が機能する
- [ ] レコメンドオファーが表示される

## 依存

- Issue 09
