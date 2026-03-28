# migration-resources INDEX

`docs/migration-resources` は、旧リポジトリから抽出した参照用資材の配置先です。
以降の移行実装では旧リポジトリを直接参照せず、このディレクトリ以下を一次情報として扱います。

## 構成

### `frontend-src/`

旧フロントエンド実装の参照用ソースです。

- `router/`
  - 画面遷移と認可境界の参考実装
- `components/`
  - 共通UI、レイアウト、フォーム、アイコン、汎用ページ
- `features/`
  - `auth`, `users`, `roasters`, `beans`, `offers`, `wants`, `likes`, `search`, `roasterRelationships`
- `index.css`
  - 旧スタイル定義
- `tailwind.config.cjs`
  - Tailwind設定
- `postcss.config.cjs`
  - PostCSS設定

### `api-spec/`

旧Rails APIの参照用実装です。

- `routes.rb`
  - APIルーティング定義
- `api_application_controller.rb`
  - 共通コントローラ処理
- `controllers-v1/`
  - `auth`, `users`, `roasters`, `beans`, `offers`, `wants`, `likes`, `search`, `roaster_relationships`
- `views-api/v1/`
  - JSONレスポンスの形状定義

### `db/`

旧DB設計と開発用データの参照資材です。

- `schema.rb`
  - テーブル定義
- `fixtures/`
  - マスタデータと開発用サンプルデータ

### `infra/`

旧インフラ・運用構成の参照資材です。

- `docker-compose.yml`
  - ローカル開発構成
- `circleci_config.yml`
  - 旧CI設定
- `readme_architecture.md`
  - 旧READMEから抽出したアーキテクチャ補足

## 運用ルール

- 実装時の参照元は `docs/NEXTJS_REPLACE_SPEC.md` と `docs/migration-resources/**` に限定する
- 旧リポジトリのソースコードを直接開いて確認しない
- バイナリアーカイブではなく、展開済みの `docs/migration-resources/` を正本として扱う
