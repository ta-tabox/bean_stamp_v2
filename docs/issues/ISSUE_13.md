# [Issue 13] Cloud Run デプロイ基盤

## 目的

アプリケーションをCloud Runで稼働させ、Cloud SQL/GCSと接続する。

## 参照リソース

- `docs/NEXTJS_REPLACE_SPEC.md`（4章, 10章）
- `docs/migration-resources/infra/docker-compose.yml`
- `docs/migration-resources/infra/readme_architecture.md`

## 実装タスク

- [ ] 本番用Dockerfile作成
- [ ] Cloud Run サービス定義
- [ ] Cloud SQL(PostgreSQL) 接続
- [ ] GCS バケット連携（画像）
- [ ] Secret Manager 参照実装
- [ ] ヘルスチェック実装

## 受け入れ条件（DoD）

- [ ] ステージング環境で起動
- [ ] DB接続、画像アップロードが動作

## 依存

- Issue 12
