# AGENTS.md

このリポジトリで作業するエージェントは、実装だけでなくテストを完了条件に含めること。

## 基本方針

- テスト駆動開発を基本とし、可能なら先に失敗するテストを書く
- テストを書けない変更でも、最低限 `lint` / `typecheck` は必ず実行する
- UI ルーティングやページ導線を触る変更では、E2E または同等の画面到達確認を追加・更新する
- 純粋関数、DTO 変換、バリデーション、server utility を触る変更では、単体テストを追加・更新する
- 開発環境や運用手順に関する修正を行った場合は、`AGENTS.md`、`README.md`、`docs/DEVELOPMENT_ENV.md` など関連ドキュメントの更新を完了条件に含める
- 旧フロントエンドの移行対象では、`docs/migration-resources/frontend-src` のスタイルと構造を基準にし、未実装モックを除いて見た目と導線を揃える
- `src/**` 配下の import は `@/` を使う。相対 import は使わない
- GitHub の PR タイトル・本文・コメントは日本語で記載する
- Issue 対応の PR 本文には、対象 Issue を閉じる `Closes #...` などのクローズ指定を必ず入れる

## コマンド原則

- 検証、整形、ビルド、Prisma 操作は、ライブラリや CLI を直接叩かず、必ず `package.json` に定義された script を `pnpm <script>` で実行する
- Docker Compose 経由で実行する場合も、`docker compose exec ... pnpm <script>` または `docker compose run --rm ... pnpm <script>` を使う
- 開発・検証は Docker Compose を正とし、ローカル直実行の成功には依存しない
- ローカルの `pnpm` 実行は、Compose が使えない場合または切り分けに必要な場合だけに限定する
- 詳細な起動手順、復旧手順、エラー切り分けは `docs/DEVELOPMENT_ENV.md` を参照する

## 標準コマンド

- 単体テスト: `docker compose exec app pnpm test:unit`
- 単体テスト標準入口: `docker compose exec app pnpm test`
- E2E: `docker compose exec e2e pnpm test:e2e`
- 静的検証: `docker compose exec app pnpm lint && docker compose exec app pnpm typecheck`
- 整形確認: `docker compose exec app pnpm format:check`
- 整形: `docker compose exec app pnpm format`
- ビルド確認: `docker compose exec app pnpm build`
- Prisma Client 再生成: `docker compose exec app pnpm prisma:generate`
- Prisma migration: `docker compose exec app pnpm prisma:migrate`
- Prisma migration deploy: `docker compose exec app pnpm prisma:migrate:deploy`
- Prisma seed: `docker compose exec app pnpm prisma:seed`
- 開発用 seed: `docker compose exec app pnpm prisma:seed:dev`
- E2E DB リセット: `docker compose exec e2e pnpm prisma:reset:e2e`

## Docker / Compose 運用

- `app` はアプリケーション実行用コンテナ、`db` は PostgreSQL、`e2e` は Playwright 実行用コンテナとして扱う
- `app` コンテナは E2E のブラウザ依存を持ち込まない
- `db` コンテナは通常開発用 `bean_stamp` と E2E 用 `bean_stamp_e2e` を同一インスタンス内に持ち、データ分離は database 名で行う
- E2E は `e2e` コンテナから実行し、Next.js 起動も `e2e` コンテナ内で完結させる
- `e2e` コンテナは `docker compose up` に含めて常駐させ、待機状態から `docker compose exec e2e ...` で呼び出す
- ホスト側の pnpm store 設定はリポジトリではなく各ローカル環境の pnpm user config で管理する
- Compose の pnpm store は共有 volume `global_pnpm_store` を `/pnpm/store` として使い、`compose.yml` の `npm_config_store_dir` で固定する
- `app` 起動時には entrypoint で `pnpm prisma:migrate:deploy` が走る前提で考える
- Prisma の migration / seed / generate は `app` コンテナから実行する
- `prisma:seed` はマスタデータ専用とし、開発用ダミーデータは `prisma:seed:dev` に分けて扱う
- Node.js 依存の導入は `docker compose run --rm app pnpm install` と `docker compose run --rm e2e pnpm install` を使う
- Prisma schema を変更した場合、または依存ボリュームを作り直した場合は、検証前に Prisma Client の再生成状態を確認する
- 通常の `docker compose up --build` では `app` / `db` / `e2e` をまとめて起動する
- UI やルーティング変更時の E2E は `docker compose exec e2e pnpm test:e2e` を標準とし、クリーンな一発実行が必要な場合だけ `docker compose run --rm e2e pnpm test:e2e` を使う
- seed データが必要な検証では、事前に `docker compose run --rm app pnpm prisma:seed` を実行する

## テスト運用ルール

- 変更があるのにテストを追加しない場合は、その理由を明記する
- コミット前に、変更内容に応じた formatter / テスト / リンターを実行する
- 作業の粒度上やむを得ない場合を除き、実行対象のテストがすべて通ることを確認してからコミットする
- テスト失敗を残したままコミットしない
- `pnpm format:check` が失敗した場合は、`pnpm format` で整形してから他の検証へ進む
- 既存テストが落ちた場合は、仕様変更か回帰かを切り分けてから修正する
- テストが失敗した場合は、まずテストコードの妥当性を確認する
- テストコードが適切なら、ソースコードを修正してテストを通す
- テストコードが古くなっている場合は、テストコードを修正してよい。ただし、何をどのような目的で直すかをユーザーに事前に伝える
- テスト、整形、lint、typecheck、build、Prisma 操作は Docker Compose 経由で実行する
- 純粋関数、DTO、バリデーション、server utility の変更では `docker compose exec app pnpm test:unit` を優先する
- UI やルーティング変更では `docker compose exec app pnpm test` に加えて `docker compose exec e2e pnpm test:e2e` を実行する
- `docker compose exec e2e pnpm test:e2e` は `bean_stamp_e2e` を毎回リセットしてからアプリ再起動と Playwright 実行を行う
- 共通レイアウトや導線の骨格を移行している段階では、E2E はデスクトップ中心の到達確認を優先する
- モバイル viewport 固有の E2E は、主要コンテンツと導線が固まった段階で追加する
- モバイル E2E を後続へ送る場合は、将来追加する方針を関連ドキュメントまたは issue に明記する

## 実装原則

- 関数やメソッドは処理レイヤーごとに責務を揃えて分割し、関数内でも同じ抽象度の処理を保つ
- メインの関数を先に置き、そこから呼ばれる詳細な補助関数は後ろに置く
- ファイルは上から下へ、概要から詳細へ自然に読める順序で構成する
- 1つの関数内でビジネス判断、文字列整形、DB I/O など異なる抽象度の処理を頻繁に切り替えない
- 外部入力は境界で検証・正規化してから内部へ渡す
- フレームワーク依存は境界に閉じ込め、下位レイヤーへ持ち込まない
- 異常系は早期 return で処理し、主処理のネストを浅く保つ
- 失敗の表現方法は層ごとに揃える
- 共通化は変更理由が一致する場合に限る
- `app/**` は Next.js の route・layout・metadata・redirect など最上位のつなぎにとどめ、細かい UI と業務ロジックは `src/**` へ切り出す

## 命名とコメント

- クラス名は名詞または名詞句を使う
- メソッド名と関数名は動詞または動詞句を使う
- 名前は処理や責務を適切に表すものにする
- 名前が決めにくい、または過度に長くなる場合は責務の分割を検討する
- コメントに頼らず、命名と処理粒度で意味が伝わるように実装する
- 詳細な処理で結果や意図の理解が難しい場合に限り、必要最小限のコメントで補足する

## 関数設計

- 関数の引数が多い場合は責務の分割不足を疑い、必要に応じて概念をオブジェクト化する
- 関数は一つのことをうまく行うことに徹する
- 関数は値を返す処理か、副作用で外部状態を変更する処理のどちらかに寄せる
- 副作用を持つ関数は必要最小限の値だけを返す
- フラグ引数は使わず、必要なら関数を分ける
- 例外は適切に送出し、原因と発生箇所を追いやすい設計にする

## NGルール

- utility や下位レイヤーから `redirect` などの画面遷移を直接行わない
- UI コンポーネントから DB や永続化層を直接操作しない
- 検証前の `FormData` や外部入力を下位レイヤーへそのまま渡さない
- 1つの関数で複数の失敗表現を混在させない
- 説明不足の短い名前や文脈依存の強い省略名を使わない
