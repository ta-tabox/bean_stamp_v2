# 開発環境ガイド

このドキュメントは、このリポジトリをローカル開発や Agent 作業でスムーズに扱うための実行手順をまとめたもの。

## 方針

- 通常の開発環境は Docker Compose を基本とする
- `app` コンテナは Next.js 開発サーバー専用とし、依存導入は別コマンドで行う
- PostgreSQL は `db` コンテナで管理する
- Prisma の migration / seed も `app` コンテナから実行する
- E2E は `e2e` コンテナに分離し、Playwright のブラウザ依存は `app` に持ち込まない
- E2E のテスト対象アプリは `app` コンテナとし、`e2e` コンテナはブラウザ実行環境のみを担当する

## サービス構成

- `app`
  - Next.js 開発サーバー
  - 公開ポート: `3000`
  - `pnpm dev` 起動時に entrypoint で `pnpm prisma:migrate:deploy` を先行し、既存 migration を自動適用する
- `db`
  - PostgreSQL 16
  - 公開ポート: `5432`
- `e2e`
  - Playwright 公式イメージベースの `Dockerfile.e2e` を使う E2E 実行用コンテナ
  - ブラウザ実体は `/ms-playwright` を使用
  - 起動済みの `app` コンテナが公開する `localhost:3000` をブラウザから叩く実行環境

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

ただし、次のケースでは `up --build` の前に Prisma Client 再生成が必要:

- `docker compose down -v` で `app_node_modules` / `e2e_node_modules` を削除した
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
docker compose up -d app
docker compose run --rm e2e pnpm install
docker compose run --rm e2e pnpm test:e2e
```

`e2e` は起動済みの `app` コンテナに対して Playwright を実行する。migration は `app` 起動時に自動適用されるため、`e2e` 側ではアプリ起動や DB 初期化を行わない。seed が必要なテストを追加した場合だけ、事前に `docker compose run --rm app pnpm prisma:seed` を実行する。

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
`pnpm prisma:seed:dev` はマスタデータに加えて、ブラウザ確認用のユーザー、ロースター、フォロー関係のサンプルデータを投入する。
ログイン確認用の共通パスワードは `password123`。
主なアカウント:

- `user1@example.com`
- `roaster1@example.com`
- `roaster2@example.com`
- `follower@example.com`

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
- E2E 実行前は `docker compose up -d app` でテスト対象アプリを起動し、`docker compose run --rm e2e pnpm install` で `e2e` 用の依存を同期する
- `app` が未起動なら、まず `docker compose up -d db` を実行する
- 依存が未導入なら `docker compose run --rm app pnpm install` を実行する。Prisma schema を変えたときだけ `docker compose exec app pnpm prisma:generate` を追加する
- DB を作り直した場合、既存 migration は `app` 起動時に自動適用される。seed データが必要なら `docker compose run --rm app pnpm prisma:seed` を実行する
- `app` のログに `Cannot find module '.prisma/client/default'` が出たら、`app` 側の Prisma Client 未生成を疑い、`docker compose run --rm app pnpm prisma:generate` を最優先で実行する
- `app` のログに `The table 'public.users' does not exist` が出たら、DB に migration が入っていない。まず `docker compose up --build app` で自動適用を試し、必要なら `docker compose exec app pnpm prisma:migrate:deploy` を実行する
- `e2e` 実行時に接続エラーが出たら、まず `docker compose ps` と `docker compose logs app` で `app` が起動しているか確認する
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
docker compose up -d app
docker compose run --rm e2e pnpm install
docker compose run --rm e2e pnpm test:e2e
```

`e2e` はブラウザ実行環境なので、Prisma schema 変更時の再生成は `app` 側だけでよい。マスターデータが必要なら `docker compose run --rm app pnpm prisma:seed` を先に実行する。

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

### `app` に接続できない / `net::ERR_CONNECTION_REFUSED`

E2E の接続先である `app` コンテナが未起動。次を実行する:

```bash
docker compose up -d app
```

状態確認:

```bash
docker compose ps
docker compose logs app
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
