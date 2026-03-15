# [Issue 14] GitHub Actions CI/CD

## 目的

GitHub Actions による CI（品質検証）と CD（Cloud Run デプロイ）を確立する。

## 参照リソース

- `docs/NEXTJS_REPLACE_SPEC.md`（10章）
- `docs/migration-resources/infra/circleci_config.yml`
- `docs/issues/ISSUE_12.md`
- `docs/issues/ISSUE_13.md`

## 実装タスク

- [ ] `ci.yml`（lint/typecheck/test/build）
- [ ] `cd.yml`（main mergeでデプロイ）
- [ ] `db-migrate.yml`（必要時）
- [ ] OIDCでGCP認証
- [ ] 失敗時通知設定

## 受け入れ条件（DoD）

- [ ] PRでCIが必ず実行される
- [ ] mainマージでCloud Runへ自動デプロイされる

## 依存

- Issue 13
