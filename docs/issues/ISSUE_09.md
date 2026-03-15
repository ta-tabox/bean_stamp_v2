# [Issue 09] Wants / Likes 機能

## 目的

ユーザーの購買意思（Want）とお気に入り（Like）機能を再実装する。

## 参照リソース

- `docs/migration-resources/api-spec/controllers-v1/wants_controller.rb`
- `docs/migration-resources/api-spec/controllers-v1/likes_controller.rb`
- `docs/migration-resources/api-spec/views-api/v1/wants`
- `docs/migration-resources/api-spec/views-api/v1/likes`
- `docs/migration-resources/frontend-src/features/wants`
- `docs/migration-resources/frontend-src/features/likes`

## 実装タスク

- [ ] Wants: 一覧/詳細/作成/削除
- [ ] Wants: `receipt`, `rate`, `stats` API
- [ ] Likes: 一覧/作成/削除
- [ ] ステータス絞り込み検索（`search` クエリ）
- [ ] Wants/Likes UI移植

## 受け入れ条件（DoD）

- [ ] Want/LikeがUIから操作できる
- [ ] Wants stats が通知表示に反映される

## 依存

- Issue 08
