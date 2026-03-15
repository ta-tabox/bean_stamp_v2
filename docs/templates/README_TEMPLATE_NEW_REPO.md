# Bean Stamp Next.js（置換版）

> このREADMEは `bean_stamp` 旧リポジトリ（React + Rails）からの移行プロジェクト用テンプレートです。  
> 旧リポジトリのコードを直接参照せず、`docs/migration-resources` のみを参照して実装します。

## 1. プロジェクト概要

Bean Stamp はコーヒー豆とコーヒー愛好家を繋ぐマッチングサービスです。  
本リポジトリは旧構成（React SPA + Rails API）を Next.js に置換した新実装です。

## 2. 移行方針（重要）

- 旧コード直接参照: 禁止
- 許可された参照元: `docs/migration-resources/**`
- 利用ライブラリ方針: 移行時点の最新安定版を採用し、lockfileで固定
- 機能等価性の基準:
  - API: `docs/migration-resources/api-spec/views-api` のレスポンス形状
  - UI: `docs/migration-resources/frontend-src` の JSX/Tailwind 表現
  - DB: `docs/migration-resources/db/schema.rb`

## 3. リポジトリ構成（例）

```txt
.
├── app/
├── src/
│   ├── server/
│   └── features/
├── prisma/
├── docs/
│   ├── migration-resources/
│   ├── decisions/
│   └── issues/
└── .github/workflows/
```

## 4. 初期セットアップ

```bash
# Node.js 22.x
corepack enable
pnpm install
cp .env.example .env.local
pnpm dev
```

## 5. 環境変数（例）

```env
NODE_ENV=development
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=replace_me
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/bean_stamp
GOOGLE_CLOUD_PROJECT=replace_me
GCS_BUCKET_UPLOADS=replace_me
```

## 6. 開発コマンド（例）

```bash
pnpm dev
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm prisma migrate dev
pnpm prisma db seed
```

## 7. 参照リソース

- 全体仕様: `docs/NEXTJS_REPLACE_SPEC.md`
- APIルート: `docs/migration-resources/api-spec/routes.rb`
- APIレスポンス仕様: `docs/migration-resources/api-spec/views-api/v1`
- 旧フロント構成: `docs/migration-resources/frontend-src/router/index.tsx`
- 旧フロント機能別: `docs/migration-resources/frontend-src/features`
- 旧DB定義: `docs/migration-resources/db/schema.rb`
- 旧CI/CD: `docs/migration-resources/infra/circleci_config.yml`

## 8. 実装プロセス

- Issue駆動で実装する（`docs/issues/ISSUE_00.md` から順に着手）
- 1 Issue = 1 関心領域
- 各Issueで以下を必須化
  - 実装
  - テスト
  - ドキュメント更新
  - 未決事項を `docs/decisions/*.md` に記録

## 9. 完了条件

- 主要機能が旧アプリ同等
- UIが大きく乖離しない
- GitHub Actions + Cloud Run でデプロイ可能
- PostgreSQLで本番相当運用可能

## 10. 既知の非対象

- rails_admin など Rails Gem ベースの管理機能
- 旧Railsテンプレート返却機能
