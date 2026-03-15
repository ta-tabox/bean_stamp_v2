#!/usr/bin/env bash
set -euo pipefail

# Create GitHub issues from docs/issues/ISSUE_*.md
# Default is dry-run. Use --execute to actually create issues.

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

REPO=""
EXECUTE="false"
LABELS="migration,nextjs-replace"
ASSIGNEES=""
MILESTONE=""
STATE_FILE="$SCRIPT_DIR/.created_issues.tsv"

usage() {
  cat <<USAGE
Usage:
  $(basename "$0") --repo <owner/repo> [options]

Options:
  --repo <owner/repo>       Target GitHub repository (required)
  --execute                 Actually create issues (default: dry-run)
  --labels <a,b,c>          Comma-separated labels (default: ${LABELS})
  --assignees <a,b>         Comma-separated assignees
  --milestone <title>       Milestone title
  --state-file <path>       Output file for created issue mapping
  -h, --help                Show help

Examples:
  $(basename "$0") --repo your-org/bean-stamp-next
  $(basename "$0") --repo your-org/bean-stamp-next --execute
  $(basename "$0") --repo your-org/bean-stamp-next --execute --labels migration,nextjs
USAGE
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --repo)
      REPO="$2"; shift 2 ;;
    --execute)
      EXECUTE="true"; shift ;;
    --labels)
      LABELS="$2"; shift 2 ;;
    --assignees)
      ASSIGNEES="$2"; shift 2 ;;
    --milestone)
      MILESTONE="$2"; shift 2 ;;
    --state-file)
      STATE_FILE="$2"; shift 2 ;;
    -h|--help)
      usage; exit 0 ;;
    *)
      echo "Unknown option: $1" >&2
      usage
      exit 1 ;;
  esac
done

if [[ -z "$REPO" ]]; then
  echo "Error: --repo is required" >&2
  usage
  exit 1
fi

if ! command -v gh >/dev/null 2>&1; then
  echo "Error: gh command not found" >&2
  exit 1
fi

FILES=()
while IFS= read -r line; do
  FILES+=("$line")
done < <(find "$SCRIPT_DIR" -maxdepth 1 -type f -name 'ISSUE_[0-9][0-9].md' | sort)
if [[ ${#FILES[@]} -eq 0 ]]; then
  echo "No issue files found in $SCRIPT_DIR" >&2
  exit 1
fi

if [[ "$EXECUTE" == "true" ]]; then
  : > "$STATE_FILE"
  echo "Creating issues in $REPO ..."
else
  echo "Dry-run mode. No issues will be created."
fi

for file in "${FILES[@]}"; do
  first_line="$(head -n 1 "$file")"
  title="${first_line#\# }"

  cmd=(gh issue create --repo "$REPO" --title "$title" --body-file "$file")

  OLDIFS="$IFS"
  IFS=','
  for label in $LABELS; do
    [[ -n "$label" ]] && cmd+=(--label "$label")
  done
  IFS="$OLDIFS"

  if [[ -n "$ASSIGNEES" ]]; then
    OLDIFS="$IFS"
    IFS=','
    for assignee in $ASSIGNEES; do
      [[ -n "$assignee" ]] && cmd+=(--assignee "$assignee")
    done
    IFS="$OLDIFS"
  fi

  if [[ -n "$MILESTONE" ]]; then
    cmd+=(--milestone "$MILESTONE")
  fi

  if [[ "$EXECUTE" == "true" ]]; then
    url="$(${cmd[@]})"
    number="$(echo "$url" | sed -E 's#.*/issues/([0-9]+)#\1#')"
    base="$(basename "$file")"
    echo -e "${base}\t#${number}\t${url}" | tee -a "$STATE_FILE"
  else
    echo "Would create: $title"
    echo "  file: $file"
    echo "  labels: $LABELS"
    [[ -n "$ASSIGNEES" ]] && echo "  assignees: $ASSIGNEES"
    [[ -n "$MILESTONE" ]] && echo "  milestone: $MILESTONE"
  fi
done

if [[ "$EXECUTE" == "true" ]]; then
  echo
  echo "Done. Created issue list: $STATE_FILE"
else
  echo
  echo "Dry-run finished. Add --execute to create issues."
fi
