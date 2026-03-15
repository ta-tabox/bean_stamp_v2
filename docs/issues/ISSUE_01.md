# [Issue 01] 移行資材取り込み（migration-resources）

## 目的

旧リポジトリから抽出した `migration-export` を新リポジトリへ取り込み、旧コード参照なしで実装できる状態にする。

## 参照リソース

- `docs/NEXTJS_REPLACE_SPEC.md`（5.2, 5.3）
- `migration-export.tar.gz`（旧リポジトリで作成）
- `migration-export.sha256`（旧リポジトリで作成）

## 実装タスク

- [ ] `docs/` 配下に `migration-export.tar.gz` と `migration-export.sha256` を配置
- [ ] sha256 検証を実行
- [ ] 展開して `docs/migration-resources/` へ配置
- [ ] 目次ファイル `docs/migration-resources/INDEX.md` を作成
- [ ] 参照禁止ルール（旧repo直接参照禁止）を README に明記

## 受け入れ条件（DoD）

- [ ] `docs/migration-resources/frontend-src` が存在
- [ ] `docs/migration-resources/api-spec` が存在
- [ ] `docs/migration-resources/db` が存在
- [ ] `docs/migration-resources/infra` が存在

## 依存

- Issue 00
