# GitHub Issue 一括作成手順

`docs/issues/ISSUE_00.md` 〜 `ISSUE_15.md` を GitHub Issue として一括登録する手順です。

## 1. 事前条件

- `gh` CLI がインストール済み
- GitHubへログイン済み

```bash
gh auth status
```

## 2. ドライラン（推奨）

```bash
./docs/issues/create_github_issues.sh --repo <owner>/<repo>
```

実行内容のみ表示され、Issueは作成されません。

## 3. 本実行

```bash
./docs/issues/create_github_issues.sh --repo <owner>/<repo> --execute
```

作成後、`docs/issues/.created_issues.tsv` に以下形式で記録されます。

```txt
ISSUE_00.md    #12    https://github.com/<owner>/<repo>/issues/12
```

## 4. オプション

ラベル指定:

```bash
./docs/issues/create_github_issues.sh --repo <owner>/<repo> --execute --labels migration,nextjs,backend
```

担当者指定:

```bash
./docs/issues/create_github_issues.sh --repo <owner>/<repo> --execute --assignees user1,user2
```

マイルストーン指定:

```bash
./docs/issues/create_github_issues.sh --repo <owner>/<repo> --execute --milestone "MVP Replace"
```

## 5. 注意事項

- デフォルトは dry-run です（`--execute` が必要）
- 既に同名Issueがある場合でも重複作成されるため、必要なら先に整理してください
- 作成順は `ISSUE_00.md` から `ISSUE_15.md` の昇順です
