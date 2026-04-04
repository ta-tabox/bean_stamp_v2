# Bean Stamp Next.js（置換版）

> このREADMEは `bean_stamp` 旧リポジトリ（React + Rails）からの移行プロジェクト用です。  
> 旧リポジトリのコードを直接参照せず、`docs/migration-resources` のみを一次情報として実装を進めます。

## 1. プロジェクト概要

Bean Stamp はコーヒー豆とコーヒー愛好家を繋ぐマッチングサービスです。  
本リポジトリは旧構成（React SPA + Rails API）を Next.js に置換する新実装です。

## 2. 移行方針

- 旧コード直接参照: 禁止
- 許可された参照元: `docs/migration-resources/**`
- 仕様の基準:
  - API: `docs/migration-resources/api-spec/views-api`
  - UI: `docs/migration-resources/frontend-src`
  - DB: `docs/migration-resources/db/schema.rb`
- 実装は `docs/issues/ISSUE_00.md` から順に進める

## 3. リポジトリ構成

```txt
.
├── app/
├── docs/
│   ├── issues/
│   ├── migration-resources/
│   └── templates/
└── src/
```

`src/` は Issue 02 以降で `server/` や `features/` を追加して拡張します。  
Issue 02 時点でルーティング骨組みと import 境界を追加しています。

## 4. 初期セットアップ

```bash
mise trust
mise install
pnpm install
cp .env.example .env.local
pnpm dev
```

Node.js と pnpm は `.mise.toml` で固定しています。現在は Node.js `24` 系 LTS を前提にしています。

Docker Compose を使う場合の標準手順は [docs/DEVELOPMENT_ENV.md](/Users/daiki/repos/github.com/ta-tabox/bean_stamp_v2/docs/DEVELOPMENT_ENV.md) を参照。

最短の起動手順:

```bash
docker compose up -d db
docker compose run --rm app pnpm install
docker compose run --rm app pnpm prisma:migrate
docker compose run --rm app pnpm prisma:seed
docker compose up --build app
```

ブラウザ確認用のユーザー、ロースター、フォロー関係まで投入したい場合は、追加で次を実行する。

```bash
docker compose run --rm app pnpm prisma:seed:dev
```

- `app`: Next.js 開発サーバーを `http://localhost:3000` で起動
- `db`: PostgreSQL 16 を `localhost:5432` で起動
- `e2e`: Playwright 公式イメージを土台にした `Dockerfile.e2e` ベースの E2E 実行専用コンテナ
  - `pnpm test:e2e` 実行時は entrypoint が `pnpm prisma:generate` を先行する

初回セットアップ後に migration や seed を追加実行する場合:

```bash
docker compose exec app pnpm prisma:migrate
docker compose exec app pnpm prisma:seed
```

`pnpm prisma:seed` は本番でも必要なマスタデータのみを投入する。
`pnpm prisma:seed:dev` はマスタデータに加えて、ブラウザ確認用のユーザー、ロースター、フォロー関係のサンプルデータを投入する。
ログイン確認用の共通パスワードは `password123`。
主なアカウント:

- `user1@example.com`
- `roaster1@example.com`
- `roaster2@example.com`
- `follower@example.com`

停止:

```bash
docker compose down
```

DB データも削除する場合:

```bash
docker compose down -v
```

## 5. 環境変数

```env
NODE_ENV=development
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=replace_me
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/bean_stamp
GOOGLE_CLOUD_PROJECT=replace_me
GCS_BUCKET_UPLOADS=replace_me
```

`src/env.ts` で `zod` によるサーバー環境変数検証を定義しています。  
本番コードでは server-side でのみ `loadServerEnv()` を呼び、client component から直接 `process.env` を触らない方針です。

## 6. 開発コマンド

```bash
pnpm dev
pnpm lint
pnpm typecheck
pnpm test
pnpm test:unit
pnpm test:e2e
pnpm format
pnpm format:check
pnpm build
```

Docker Compose 経由の主要コマンド:

```bash
docker compose exec app pnpm lint
docker compose exec app pnpm typecheck
docker compose exec app pnpm test
docker compose exec app pnpm test:unit
docker compose run --rm e2e pnpm install
docker compose run --rm e2e pnpm test:e2e
docker compose exec app pnpm format:check
docker compose exec app pnpm prisma:migrate
docker compose exec app pnpm prisma:seed
```

## 7. 参照ドキュメント

- 全体仕様: `docs/NEXTJS_REPLACE_SPEC.md`
- 開発環境ガイド: `docs/DEVELOPMENT_ENV.md`
- 移行資材INDEX: `docs/migration-resources/INDEX.md`
- Issue一覧: `docs/issues/ISSUE_INDEX.md`
- Issue 00: `docs/issues/ISSUE_00.md`
- Issue 02: `docs/issues/ISSUE_02.md`
- READMEテンプレート: `docs/templates/README_TEMPLATE_NEW_REPO.md`
- エージェント運用: `AGENTS.md`

## 8. アーキテクチャ境界

- `app/`: ルート定義とレイアウトのみ置く。UI 組み立てに必要な薄い責務に限定する
- `src/features/*`: ドメインごとの route metadata や機能固有 UI を置く
- `src/components/*`: 特定機能に依存しない shared component / layout を置く
- `src/server/*`: DB / Auth / API / DTO / エラー変換などサーバー専用コードを置く
- `src/env.ts`: 環境変数の読み込みとバリデーションを一元化する

import ルール:

- `app/*` は `src/features/*` と `src/components/*` と `src/server/*` を import してよい
- `src/**` 配下の import は `@/` エイリアスを使い、相対 import を使わない
- `src/features/*` は `src/server/*` を直接 import しない
- `src/features/*` は機能非依存の共通 UI を持たない
- `src/components/*` は業務ロジックや DB / Auth を持たない
- `src/server/*` は `src/features/*` を import しない
- API エラーは `AppError` を `toApiErrorResponse()` で JSON 化する
- 画面エラーは `ScreenErrorState` のような UI コンポーネントで吸収し、内部例外をそのまま表示しない

## 9. Issue 02 の完了条件

- `pnpm dev` で主要ルートが 404 にならず遷移できる
- `pnpm lint` が成功する
- `pnpm typecheck` が成功する
- README にサーバー層の import 境界が記載されている

## 10. テスト方針

- テスト駆動開発を基本とし、可能なら失敗するテストを先に追加してから実装する
- `pnpm test` は単体テストの標準入口として扱う
- 画面遷移やルーティング変更では `pnpm test:e2e` を更新し、主要ルートの到達性を維持する
- バリデーション、DTO、サーバー utility、純粋関数には `pnpm test:unit` で単体テストを追加する
- コミット前に `pnpm format:check` を実行し、失敗した場合は `pnpm format` で整形する
- 変更を仕上げる前に、少なくとも `pnpm lint` と `pnpm typecheck` を実行する
- UI 変更を含むコミット前の標準確認は `pnpm test` と `pnpm test:e2e` をセットで実行する
