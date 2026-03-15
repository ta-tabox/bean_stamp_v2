# [Issue 15] 受け入れテスト / 本番切替

## 目的

機能・非機能を最終確認し、本番切替可否を判断する。

## 参照リソース

- `docs/NEXTJS_REPLACE_SPEC.md`（13章, 15章）
- `docs/issues/ISSUE_00.md` 〜 `docs/issues/ISSUE_14.md`
- `docs/decisions/*.md`

## 実装タスク

- [ ] 受け入れテスト（主要導線）
- [ ] パフォーマンス確認
- [ ] ログ/監視/アラート確認
- [ ] ロールバック手順の確認
- [ ] 切替判断記録を `docs/decisions/` に保存

## 受け入れ条件（DoD）

- [ ] 主要要件の合格
- [ ] 切替手順・ロールバック手順が文書化済み

## 依存

- Issue 14
