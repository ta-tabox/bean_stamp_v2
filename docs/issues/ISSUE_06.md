# [Issue 06] Users / Roasters / Follow 機能

## 目的

ユーザー・ロースター・フォロー関係の主要機能を再実装する。

## 参照リソース

- `docs/migration-resources/api-spec/routes.rb`
- `docs/migration-resources/api-spec/controllers-v1/users_controller.rb`
- `docs/migration-resources/api-spec/controllers-v1/roasters_controller.rb`
- `docs/migration-resources/api-spec/controllers-v1/roaster_relationships_controller.rb`
- `docs/migration-resources/api-spec/views-api/v1/users`
- `docs/migration-resources/api-spec/views-api/v1/roasters`
- `docs/migration-resources/api-spec/views-api/v1/roaster_relationships`
- `docs/migration-resources/frontend-src/features/users`
- `docs/migration-resources/frontend-src/features/roasters`
- `docs/migration-resources/frontend-src/features/roasterRelationships`

## 実装タスク

- [ ] Users: 詳細/編集/削除
- [ ] Roasters: 作成/詳細/編集/削除
- [ ] Follow: フォロー/解除/状態取得
- [ ] followers / followed roasters 一覧
- [ ] 権限制御（所属ロースターのみ更新可）

## 受け入れ条件（DoD）

- [ ] User画面・Roaster画面・Follow導線が動作
- [ ] APIレスポンス形状が旧仕様と整合

## 依存

- Issue 05
