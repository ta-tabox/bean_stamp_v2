# [Issue 12] テスト整備（Unit / Integration / E2E）

## 目的

回帰を防ぐため、主要導線に対するテストを整備する。

## 参照リソース

- `docs/NEXTJS_REPLACE_SPEC.md`（11章, 15章）
- `docs/migration-resources/infra/circleci_config.yml`（旧テスト観点）
- `docs/issues/ISSUE_04.md` 〜 `docs/issues/ISSUE_11.md`

## 実装タスク

- [ ] Unit test（ドメインロジック、バリデーション）
- [ ] API integration test（主要エンドポイント）
- [ ] E2E（認証、Beans、Offers、Wants）
- [ ] CIでテストを必須化

## 受け入れ条件（DoD）

- [ ] PRでテストが自動実行される
- [ ] 主要導線のE2Eが安定して通る

## 依存

- Issue 11
