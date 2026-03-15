# [Issue 11] ページネーション / 通知 / 状態管理

## 目的

一覧系UIのページネーションと通知バッジ更新を安定動作させる。

## 参照リソース

- `docs/migration-resources/api-spec/api_application_controller.rb`
- `docs/migration-resources/api-spec/controllers-v1/*_controller.rb`（一覧API）
- `docs/migration-resources/frontend-src/hooks/usePagination.ts`
- `docs/migration-resources/frontend-src/stores/pageState.ts`
- `docs/migration-resources/frontend-src/components/Layout/Aside`

## 実装タスク

- [ ] pagination仕様を確定（header継続 or body meta）
- [ ] 共通pagination hookを実装
- [ ] 通知表示ロジック（roaster/user aside）実装
- [ ] API呼び出し状態管理を統一（React Query等）

## 受け入れ条件（DoD）

- [ ] 一覧画面でページ移動が可能
- [ ] 通知件数がAPI結果と整合

## 依存

- Issue 10
