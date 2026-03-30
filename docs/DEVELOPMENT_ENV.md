# 開発環境ガイド

このドキュメントは、このリポジトリをローカル開発や Agent 作業でスムーズに扱うための実行手順をまとめたもの。

## 方針

- 通常の開発環境は Docker Compose を基本とする
- `app` コンテナは Next.js 開発サーバー専用とし、依存導入は別コマンドで行う
- PostgreSQL は `db` コンテナで管理する
- Prisma の migration / seed も `app` コンテナから実行する
- E2E は `e2e` コンテナに分離し、Playwright のブラウザ依存は `app` に持ち込まない

## サービス構成

- `app`
  - Next.js 開発サーバー
  - 公開ポート: `3000`
- `db`
  - PostgreSQL 16
  - 公開ポート: `5432`
- `e2e`
  - Playwright 公式イメージベースの `Dockerfile.e2e` を使う E2E 実行用コンテナ
  - ブラウザ実体は `/ms-playwright` を使用
  - `pnpm test:e2e` 実行時だけ entrypoint で `pnpm prisma:generate` を先行実行する

## 初回セットアップ

### 1. 開発環境を起動

```bash
docker compose up -d db
```

### 2. Node.js 依存を導入

```bash
docker compose run --rm app pnpm install
```

### 3. DB を初期化

```bash
docker compose run --rm app pnpm prisma:migrate
docker compose run --rm app pnpm prisma:seed
```

### 4. アプリを起動

```bash
docker compose up --build app
```

ブラウザで `http://localhost:3000` を開く。

## 日常的な起動手順

```bash
docker compose up --build
```

バックグラウンド実行:

```bash
docker compose up -d --build
```

## 停止と削除

停止:

```bash
docker compose down
```

DB データも削除:

```bash
docker compose down -v
```

## テストと検証

### Docker Compose 経由

単体テスト:

```bash
docker compose exec app pnpm test:unit
```

単体テスト標準入口:

```bash
docker compose exec app pnpm test
```

E2E:

```bash
docker compose run --rm e2e pnpm install
docker compose run --rm e2e pnpm test:e2e
```

Lint:

```bash
docker compose exec app pnpm lint
```

Typecheck:

```bash
docker compose exec app pnpm typecheck
```

整形確認:

```bash
docker compose exec app pnpm format:check
```

整形:

```bash
docker compose exec app pnpm format
```

### Docker を使わずローカルで実行する場合

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm test:unit
pnpm test:e2e
pnpm format:check
```

この場合は、別途 PostgreSQL を起動し、`.env.local` の `DATABASE_URL` を有効にしておくこと。

## Prisma / DB 操作

migration 実行:

```bash
docker compose exec app pnpm prisma:migrate
```

seed 実行:

```bash
docker compose exec app pnpm prisma:seed
```

Prisma Client 再生成:

```bash
docker compose exec app pnpm prisma:generate
```

DB テーブル確認:

```bash
docker compose exec db psql -U postgres -d bean_stamp -c "\\dt"
```

## Agent 作業向けの運用メモ

- 作業開始時は `docker compose ps` で `app` と `db` の状態を確認する
- E2E 実行前は `docker compose run --rm e2e pnpm install` で `e2e` 用の依存を同期する
- `app` が未起動なら、まず `docker compose up -d db` を実行する
- 依存が未導入なら `docker compose run --rm app pnpm install` を実行する
- DB を作り直した場合は `docker compose run --rm app pnpm prisma:migrate` と `docker compose run --rm app pnpm prisma:seed` を実行する
- UI やルーティング変更時は `docker compose run --rm e2e pnpm test:e2e` まで実行する
- 純粋関数や server utility の変更時は `docker compose exec app pnpm test:unit` を実行する
- 最低限の静的検証は `docker compose exec app pnpm lint` と `docker compose exec app pnpm typecheck`

## よく使う確認コマンド

サービス状態:

```bash
docker compose ps
```

アプリログ:

```bash
docker compose logs -f app
```

DB ログ:

```bash
docker compose logs -f db
```
