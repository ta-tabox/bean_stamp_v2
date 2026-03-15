# [Issue 02] アーキテクチャ骨組み（App / Server層分離）

## 目的

Next.js内の責務を整理し、UI層とサーバー処理層を分離した構成を確立する。

## 参照リソース

- `docs/NEXTJS_REPLACE_SPEC.md`（8章, 9章）
- `docs/migration-resources/frontend-src/router/index.tsx`
- `docs/migration-resources/api-spec/routes.rb`

## 実装タスク

- [ ] ルーティング骨組み（`app/(public)`, `app/(auth)`, `app/(app)`）を作成
- [ ] `src/server` に DB/Auth/API/DTO の基本構成を作成
- [ ] `src/features` にドメイン単位のフォルダを作成
- [ ] 環境変数読み込みをzodで実装
- [ ] エラーハンドリング方針（API/画面）を定義

## 受け入れ条件（DoD）

- [ ] 主要ルートが404にならず遷移できる
- [ ] サーバー層のimport境界がREADMEに明記されている

## 依存

- Issue 01
