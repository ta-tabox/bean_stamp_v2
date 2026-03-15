# [Issue 04] 認証基盤（Auth.js）

## 目的

サインアップ/サインイン/サインアウト/セッション取得/パスワード再設定を実装する。

## 参照リソース

- `docs/NEXTJS_REPLACE_SPEC.md`（7.1）
- `docs/migration-resources/api-spec/routes.rb`
- `docs/migration-resources/api-spec/controllers-v1/auth/registrations_controller.rb`
- `docs/migration-resources/api-spec/controllers-v1/auth/sessions_controller.rb`
- `docs/migration-resources/api-spec/views-api/v1/auth/sessions/index.json.jbuilder`
- `docs/migration-resources/frontend-src/features/auth`

## 実装タスク

- [ ] Auth.js を導入しユーザーテーブルと連携
- [ ] サインアップ/サインイン画面実装
- [ ] サインアウト導線実装
- [ ] セッション取得API実装
- [ ] パスワードリセット（メール送信 + 更新）実装
- [ ] 認可ガード（未認証/認証済/ロースター所属条件）を実装

## 受け入れ条件（DoD）

- [ ] 認証関連E2Eが通る
- [ ] 未認証ユーザーが保護ページへアクセスできない

## 依存

- Issue 03
