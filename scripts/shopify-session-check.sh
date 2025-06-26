#!/bin/bash
# Confirms Shopify session is valid
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

response=$(curl -s -o /dev/null -D - "$DEPLOY_URL/admin/dashboard")
status=$(echo "$response" | head -n 1 | awk '{print $2}')
location=$(echo "$response" | grep -i '^location:' | awk '{print $2}' | tr -d '\r')

if [[ "$location" == */login* ]]; then
  echo "🚫 Session invalid – redirected to /login"
else
  echo "✅ Session valid with status $status"
fi
