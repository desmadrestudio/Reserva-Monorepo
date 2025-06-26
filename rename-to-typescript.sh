#!/bin/bash

# Navigate to app directory
cd apps/reserva-ui

echo "🔍 Renaming .js to .ts ..."
find ./app -type f -name "*.js" -exec bash -c 'mv "$0" "${0%.js}.ts"' {} \;

echo "🔍 Renaming .jsx to .tsx ..."
find ./app -type f -name "*.jsx" -exec bash -c 'mv "$0" "${0%.jsx}.tsx"' {} \;

echo "✅ Rename complete!"