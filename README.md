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
Issue 00 の時点では `app/` を中心に最小構成のみを用意しています。

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

Issue 00 では雛形のみ定義し、実際の利用は後続 Issue で追加します。

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
- Issue一覧: `docs/issues/ISSUE_INDEX.md`
- Issue 00: `docs/issues/ISSUE_00.md`
- READMEテンプレート: `docs/templates/README_TEMPLATE_NEW_REPO.md`

## 8. Issue 00 の完了条件

- `pnpm dev` で App Router の初期画面が起動する
- `pnpm lint` が成功する
- `pnpm typecheck` が成功する
- README にセットアップ手順が記載されている
