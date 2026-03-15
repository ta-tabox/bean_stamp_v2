# [Issue 05] 共通UI基盤移植（Layout/Nav/共通パーツ）

## 目的

旧フロントの共通レイアウト・ナビゲーションをNext.jsへ移植し、画面土台を一致させる。

## 参照リソース

- `docs/NEXTJS_REPLACE_SPEC.md`（8章）
- `docs/migration-resources/frontend-src/index.css`
- `docs/migration-resources/frontend-src/components/Layout`
- `docs/migration-resources/frontend-src/components/Elements`
- `docs/migration-resources/frontend-src/components/Icon`

## 実装タスク

- [ ] Header/CommonLayout/MainLayout を移植
- [ ] SideNav/BottomNav/TopNav を移植
- [ ] 通知表示領域を配置
- [ ] 共通スタイル（Tailwind + index.css）を適用
- [ ] モバイル/デスクトップ表示崩れを修正

## 受け入れ条件（DoD）

- [ ] `/`, `/about`, `/help` の共通レイアウトが表示される
- [ ] ナビゲーションが各主要ページへ遷移できる

## 依存

- Issue 04
