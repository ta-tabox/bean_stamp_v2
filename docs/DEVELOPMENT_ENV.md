# 開発環境ガイド

このドキュメントは、このリポジトリをローカル開発や Agent 作業でスムーズに扱うための実行手順をまとめたもの。

## 方針

- 通常の開発環境は Docker Compose を基本とする
- `app` コンテナは Next.js 開発サーバー専用とし、依存導入は別コマンドで行う
- PostgreSQL は `db` コンテナ 1 つで管理し、通常開発用 `bean_stamp` と E2E 用 `bean_stamp_e2e` を database 名で分離する
- Prisma の migration / seed も `app` コンテナから実行する
- ホスト側の pnpm store 設定はリポジトリではなく各ローカル環境の pnpm user config で管理する
- Compose では共有 volume `global_pnpm_store` を `/pnpm/store` として使い、`compose.yml` の `npm_config_store_dir` で固定する
- E2E は `e2e` コンテナに分離し、Playwright のブラウザ依存は `app` に持ち込まない
- E2E のテスト対象アプリは `e2e` コンテナ内で起動し、通常開発用 DB を書き換えない
- `e2e` の `/app/.next` は専用 volume に分離し、`app` コンテナの Next.js 開発生成物と干渉させない

## サービス構成

- `app`
  - Next.js 開発サーバー
  - 公開ポート: `3000`
  - `pnpm dev` は `next dev --webpack` を実行し、entrypoint で `pnpm prisma:migrate:deploy` を先行して既存 migration を自動適用する
- `db`
  - PostgreSQL 16
  - 公開ポート: `5432`
  - 開発用 `bean_stamp` と E2E 用 `bean_stamp_e2e` を同一インスタンス内に保持
- `e2e`
  - Playwright 公式イメージベースの `Dockerfile.e2e` を使う E2E 実行用コンテナ
  - ブラウザ実体は `/ms-playwright` を使用
  - 通常の `docker compose up` に含めて起動し、既定コマンドで待機する
  - 既定コマンドは `sleep infinity` で、常駐させた状態に対して `docker compose exec e2e ...` を実行できる
  - `pnpm test:e2e` はラッパースクリプト経由で `bean_stamp_e2e` を作成または再利用し、DB リセット、Next.js 再起動、待機、Playwright 実行を同一コンテナで完結する
  - `.next` は `e2e_next` volume を `/app/.next` へ mount し、通常開発用の `app` と分離する

## 初回セットアップ

### 1. 開発環境を起動

```bash
docker compose up -d db
```

### 2. Node.js 依存を導入

```bash
docker compose run --rm app pnpm install
docker compose run --rm e2e pnpm install
```

`pnpm install` には `postinstall` で `prisma generate` が含まれているため、`app` / `e2e` ともに依存導入直後の Prisma Client 生成は自動で行われる。

`app` は開発サーバー起動時に `pnpm prisma:migrate:deploy` を自動実行するため、空の DB であっても既存 migration は自動適用される。

ただし `app` は `prisma:generate` や `prisma:seed` までは自動実行しない。`pnpm install` を経由せずに既存ボリュームだけを流用している場合や、Prisma schema を変更した直後は、必要に応じて明示的に `pnpm prisma:generate` を実行する。マスターデータが必要な場合は `pnpm prisma:seed` を別途実行する。

`e2e` 側の `bean_stamp_e2e` は、初回の `docker compose exec e2e pnpm test:e2e` または `docker compose run --rm e2e pnpm test:e2e` 実行時に自動作成される。通常開発の起動手順で事前作成する必要はない。

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

補足:

- Next.js 16 の Turbopack 開発モードでは、`Performance.measure` の負値エラーが出ることがあるため、このリポジトリでは開発時のみ webpack モードを標準にしている

## 日常的な起動手順

```bash
docker compose up --build
```

この `up --build` では `app` / `db` / `e2e` が起動する。`e2e` は待機状態のため、通常開発中の負荷は小さい。

バックグラウンド実行:

```bash
docker compose up -d --build
```

ただし、次のケースでは `up --build` の前に Prisma Client 再生成が必要:

- `docker compose down -v` で `app_node_modules` / `e2e_node_modules` を削除した
- `docker compose down -v` で `e2e_next` を含む依存 volume を削除した
- `docker volume rm` で Node.js 依存のボリュームを削除した
- `prisma/schema.prisma` を変更した

その場合は次を先に実行する。依存ボリュームを作り直したケースでは `pnpm install` の `postinstall` により Prisma Client も同時に再生成される。

```bash
docker compose run --rm app pnpm install
docker compose run --rm e2e pnpm install
```

Prisma schema を変更した場合は、`pnpm install` を伴わなくても明示的に再生成する:

```bash
docker compose exec app pnpm prisma:generate
```

その後に DB を作り直していて seed データも必要なら、seed を再実行する:

```bash
docker compose run --rm app pnpm prisma:seed
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
docker compose exec e2e pnpm test:e2e
```

`e2e` は `app` コンテナ起動を前提にしない。`pnpm test:e2e` が `bean_stamp_e2e` の存在確認、`pnpm prisma:reset:e2e` による初期化、Next.js の起動と待機、Playwright 実行までを担う。通常開発用 `bean_stamp` は書き換えない。seed が必要な E2E を追加した場合は、`prisma:reset:e2e` に含まれる標準 seed で足りるかをまず確認し、不足分だけ E2E 用フローに組み込む。

クリーンな一発実行が必要な場合:

```bash
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

E2E をローカルで直実行する場合は、通常開発用とは別 database を使う。例:

```bash
E2E_DB_ADMIN_URL=postgresql://postgres:postgres@localhost:5432/postgres \
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/bean_stamp_e2e \
pnpm test:e2e
```

## Prisma / DB 操作

migration 実行:

```bash
docker compose exec app pnpm prisma:migrate
```

既存 migration の自動適用確認:

```bash
docker compose exec app pnpm prisma:migrate:deploy
```

seed 実行:

```bash
docker compose exec app pnpm prisma:seed
```

開発用のユーザー、ロースター、フォロー関係まで投入する場合:

```bash
docker compose exec app pnpm prisma:seed:dev
```

`pnpm prisma:seed` は本番でも必要なマスタデータのみを投入する。
`pnpm prisma:seed:dev` はマスタデータに加えて、ブラウザ確認用の複数ユーザー、複数ロースター、フォロー、豆、オファー、Like / Want のサンプルデータを投入する。
ログイン確認用の共通パスワードは `password123`。
主なアカウント:

- `user1@example.com`
- `user2@example.com`
- `user3@example.com`
- `roaster1@example.com`
- `roaster2@example.com`
- `roaster3@example.com`
- `roaster4@example.com`
- `follower@example.com`

投入される開発用アカウント、豆、オファーの詳細は [docs/DEVELOPMENT_SEED.md](/Users/daiki/repos/github.com/ta-tabox/bean_stamp_v2/docs/DEVELOPMENT_SEED.md) を参照。

Prisma Client 再生成:

```bash
docker compose exec app pnpm prisma:generate
```

DB テーブル確認:

```bash
docker compose exec db psql -U postgres -d bean_stamp -c "\\dt"
```

E2E 用 DB テーブル確認:

```bash
docker compose exec db psql -U postgres -d bean_stamp_e2e -c "\\dt"
```

## Agent 作業向けの運用メモ

- 作業開始時は `docker compose ps` で `app` と `db` の状態を確認する
- E2E 実行前は `docker compose up -d` で `e2e` を含めて起動しておき、`docker compose exec e2e pnpm test:e2e` を実行する
- 依存ボリュームを作り直した直後だけ `docker compose run --rm e2e pnpm install` で `e2e` 用依存を同期する
- `app` が未起動でも E2E 実行は可能だが、普段のローカル運用では `docker compose up -d` で 3 コンテナとも起動しておく
- 依存が未導入なら `docker compose run --rm app pnpm install` を実行する。Prisma schema を変えたときだけ `docker compose exec app pnpm prisma:generate` を追加する
- DB を作り直した場合、既存 migration は `app` 起動時に自動適用される。seed データが必要なら `docker compose run --rm app pnpm prisma:seed` を実行する
- `app` のログに `Cannot find module '.prisma/client/default'` が出たら、`app` 側の Prisma Client 未生成を疑い、`docker compose run --rm app pnpm prisma:generate` を最優先で実行する
- `app` のログに `The table 'public.users' does not exist` が出たら、DB に migration が入っていない。まず `docker compose up --build app` で自動適用を試し、必要なら `docker compose exec app pnpm prisma:migrate:deploy` を実行する
- `e2e` 実行時に接続エラーが出たら、まず `docker compose ps` で `db` と `e2e` の状態を確認し、次に `docker compose exec e2e pnpm test:e2e` の出力内に表示される Next.js ログを確認する
- UI やルーティング変更時は `docker compose run --rm e2e pnpm test:e2e` まで実行する
- 純粋関数や server utility の変更時は `docker compose exec app pnpm test:unit` を実行する
- 最低限の静的検証は `docker compose exec app pnpm lint` と `docker compose exec app pnpm typecheck`

## 再作成時の復旧手順

`app` または `e2e` のコンテナ再作成後に依存ボリュームが新しくなった場合は、次の順で復旧する。

### `app` コンテナ

```bash
docker compose up -d db
docker compose run --rm app pnpm install
docker compose up --build app
```

`app` 起動時に `pnpm prisma:migrate:deploy` が自動で走るため、既存 migration の適用は省略できる。Prisma schema を変更していて `pnpm install` を挟まない場合だけ、別途 `docker compose exec app pnpm prisma:generate` を実行する。マスターデータが必要なら `docker compose run --rm app pnpm prisma:seed` を追加する。

### `e2e` コンテナ

```bash
docker compose up -d db
docker compose run --rm e2e pnpm install
docker compose up -d e2e
docker compose exec e2e pnpm test:e2e
```

`e2e` はブラウザ実行環境に加えてテスト対象アプリの起動も担う。`pnpm test:e2e` では `bean_stamp_e2e` をリセットして標準 seed を入れ直すため、通常開発用 `bean_stamp` は汚れない。Prisma schema 変更時は `docker compose run --rm e2e pnpm install` で依存と Prisma Client を同期してから再実行する。

## エラー切り分け

### `Cannot find module '.prisma/client/default'`

Prisma Client 未生成。次を実行する:

```bash
docker compose run --rm app pnpm install
docker compose run --rm e2e pnpm install
```

Prisma schema を変更していて install を挟まない場合は次も追加する:

```bash
docker compose exec app pnpm prisma:generate
```

### `The table 'public.users' does not exist`

DB に migration が未適用。次を実行する:

```bash
docker compose up --build app
```

それでも解消しない場合は明示的に適用する:

```bash
docker compose exec app pnpm prisma:migrate:deploy
```

マスターデータも必要なら追加で:

```bash
docker compose run --rm app pnpm prisma:seed
```

### `127.0.0.1:3000` に接続できない / `net::ERR_CONNECTION_REFUSED`

`e2e` コンテナ内の Next.js 起動失敗か、起動待機中に異常終了している。まず `docker compose exec e2e pnpm test:e2e` を再実行し、標準エラーに出る Next.js ログを確認する。

補助確認:

```bash
docker compose ps
docker compose logs db
```

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
