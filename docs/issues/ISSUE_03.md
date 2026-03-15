# [Issue 03] DB実装（PostgreSQL + Prisma）

## 目的

旧DBスキーマを PostgreSQL + Prisma で再現する。

## 参照リソース

- `docs/NEXTJS_REPLACE_SPEC.md`（6章）
- `docs/migration-resources/db/schema.rb`
- `docs/migration-resources/db/fixtures`

## 実装タスク

- [ ] Prisma schema を作成（users, roasters, beans, offers, wants, likes ほか）
- [ ] enum（Offer.status, Want.rate）を定義
- [ ] FK / unique 制約を再現
- [ ] 初回migrationを作成
- [ ] seed script（country/roast_level/taste_tag）を実装

## 受け入れ条件（DoD）

- [ ] `prisma migrate dev` が成功
- [ ] `prisma db seed` が成功
- [ ] 主要テーブルとリレーションが旧仕様と一致

## 依存

- Issue 02
