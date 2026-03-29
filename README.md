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
pnpm format
pnpm format:check
pnpm build
```

## 7. 参照ドキュメント

- 全体仕様: `docs/NEXTJS_REPLACE_SPEC.md`
- 移行資材INDEX: `docs/migration-resources/INDEX.md`
- Issue一覧: `docs/issues/ISSUE_INDEX.md`
- Issue 00: `docs/issues/ISSUE_00.md`
- Issue 02: `docs/issues/ISSUE_02.md`
- READMEテンプレート: `docs/templates/README_TEMPLATE_NEW_REPO.md`

## 8. アーキテクチャ境界

- `app/`: ルート定義とレイアウトのみ置く。UI 組み立てに必要な薄い責務に限定する
- `src/features/*`: ドメインごとの route metadata や機能固有 UI を置く
- `src/components/*`: 特定機能に依存しない shared component / layout を置く
- `src/server/*`: DB / Auth / API / DTO / エラー変換などサーバー専用コードを置く
- `src/env.ts`: 環境変数の読み込みとバリデーションを一元化する

import ルール:

- `app/*` は `src/features/*` と `src/components/*` と `src/server/*` を import してよい
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
