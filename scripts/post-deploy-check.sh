#!/bin/bash
# Post-deploy health checks for Render deployment
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEPLOY_URL="${RENDER_DEPLOY_URL:-}"
if [[ -z "$DEPLOY_URL" && -f "$REPO_ROOT/.env" ]]; then
  DEPLOY_URL=$(grep -E '^RENDER_DEPLOY_URL=' "$REPO_ROOT/.env" | cut -d '=' -f2)
fi

if [[ -z "$DEPLOY_URL" ]]; then
  echo "RENDER_DEPLOY_URL not set" >&2
  exit 1
fi

check_path() {
  local path="$1"
  local result
  result=$(curl -s -w "%{http_code}" "$DEPLOY_URL$path")
  local code="${result:(-3)}"
  local body="${result::${#result}-3}"
  if [[ "$code" != "200" ]]; then
    echo "Error: $path returned status $code" >&2
    exit 1
  fi
  if echo "$body" | grep -qi '<html'; then
    echo "$path returned 200 and valid HTML"
  else
    echo "$path returned 200 but no HTML"
  fi
}

check_path "/admin/dashboard"
check_path "/auth/callback"

echo "✅ Post-deploy checks passed."
