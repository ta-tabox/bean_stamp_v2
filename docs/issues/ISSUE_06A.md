# [Issue 06A] Users / Roasters スタイル調整

## 目的

Issue 06 で実装した Users / Roasters / Follow の機能を、旧フロントの見た目と画面構成に寄せて整える。
共通 UI 基盤だけでは埋まっていない差分を解消し、Issue 07 以降の機能追加前に画面の土台を揃える。

## 背景

- Issue 05 で共通レイアウトとナビゲーションは移植できている
- ただし `app/globals.css` と Users / Roasters 画面は、旧 `front/src/index.css` と各ページ実装に対して見た目の差分が大きい
- 現状は機能導線を優先したため、フォーム・カード・一覧・見出し・空状態が暫定 UI のまま残っている

## 現状との差分

### 共通スタイル

- フォントが旧 `Noto Sans JP` / `Noto Serif` ではなく、独自の `Avenir Next` ベースになっている
- 旧 `index.css` の `.btn`, `.title-font`, `.logo-font`, pagination, search form などの共通スタイルが未反映
- 背景色、境界線、余白、角丸、見出し階層が旧画面より強くアレンジされている

### Users / Roasters 詳細画面

- 旧画面は `ContentHeader` + `UserCard` / `RoasterCard` の構成だが、現状は簡易的な情報パネル表示になっている
- サムネイル、補助情報、関連リンクの配置が旧画面と異なる
- フォロー導線や編集導線の見た目が共通パターン化されていない

### 編集画面

- 旧画面は `FormContainer` / `FormMain` / `FormFooter` ベースのフォーム構成だが、現状は単純な input 群のみ
- エラーメッセージや補助リンクの表示位置が旧 UI と異なる
- ユーザー編集とロースター編集でフォーム体裁の共通化が弱い

### Follow 一覧画面

- 旧画面はカード内リスト表示、空状態、検索導線、pagination 前提の構造になっている
- 現状は単純なカード反復で、一覧専用レイアウトや空状態の表現が不足している

### レスポンシブ

- 共通レイアウトはあるが、Users / Roasters 画面個別のモバイル時の余白・情報折り返し・CTA 配置の調整が不足している

## 参照リソース

- `docs/NEXTJS_REPLACE_SPEC.md`（8章）
- `docs/migration-resources/frontend-src/index.css`
- `docs/migration-resources/frontend-src/components/Elements`
- `docs/migration-resources/frontend-src/components/Form`
- `docs/migration-resources/frontend-src/features/users/components/pages/*`
- `docs/migration-resources/frontend-src/features/roasters/components/pages/*`

## 実装タスク

- [ ] `app/globals.css` を見直し、旧 `index.css` に近いタイポグラフィ、色、共通 class 方針へ寄せる
- [ ] ヘッダ、セクション見出し、ボタン、カード、空状態の共通スタイルを整理する
- [ ] Users 詳細画面を旧 `UserCard` 相当の情報構成に寄せる
- [ ] Roasters 詳細画面を旧 `RoasterCard` 相当の情報構成に寄せる
- [ ] Users 編集画面を旧 `FormContainer` 系の構成に寄せ、補助リンクとエラー表示位置を整理する
- [ ] Roasters 編集画面を Users 編集画面と同じフォームパターンへ揃える
- [ ] Follow 一覧画面をカード内リスト + 空状態 + 次の pagination 追加に耐える構造へ整える
- [ ] `src/components` または `src/features/*/components` に、Users / Roasters で再利用する表示コンポーネントを切り出す
- [ ] モバイル / デスクトップで主要画面の崩れを確認し、必要な Tailwind class を調整する
- [ ] E2E の画面到達確認を更新し、主要導線の回帰を防ぐ

## スコープ外

- Beans 以降の機能画面のスタイル調整
- pagination の実装そのもの
- 通知バッジや状態管理の実装
- 旧 CSS をそのまま完全コピーすること

## 受け入れ条件（DoD）

- [ ] `/users/[id]`, `/users/edit`, `/users/[id]/following` が旧画面と大きく乖離しない情報設計と見た目になる
- [ ] `/roasters/[id]`, `/roasters/edit`, `/roasters/[id]/follower` が旧画面と大きく乖離しない情報設計と見た目になる
- [ ] Users / Roasters の詳細・編集・一覧で、ボタン・カード・フォームの見た目に一貫性がある
- [ ] モバイルとデスクトップで主要 CTA と本文が崩れず表示される
- [ ] `pnpm format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm test:e2e` が通る

## 実装プラン

1. 旧 `index.css` と現行 `app/globals.css` の差分から、共通トークンと再利用 class の採用方針を決める
2. Users / Roasters 共通で使う表示パーツを `src/components` 配下へ抽出する
3. Users 詳細・編集・Follow 一覧を旧画面構成へ寄せる
4. Roasters 詳細・編集・Follower 一覧を同じ設計方針で揃える
5. モバイル表示を調整し、E2E を更新して回帰確認する

## 依存

- Issue 06

## 備考

- Issue 07 に進む前の見た目調整パスとして扱う
- pagination / 通知 / 状態管理への接続点は壊さず、Issue 11 で拡張しやすい DOM 構造を優先する
