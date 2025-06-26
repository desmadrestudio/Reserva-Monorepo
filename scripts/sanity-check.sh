#!/bin/bash
# Lint, test, validate Prisma, and check Shopify session
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

npm run lint
npm run test
npx prisma validate

"$REPO_ROOT/scripts/shopify-session-check.sh"

echo "✅ Sanity checks passed."
