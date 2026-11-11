#!/bin/sh
set -e

echo "==> [1/2] Sinkronisasi dependensi client..."
npm install --no-audit --no-fund

echo "==> [2/2] Starting Vite dev server..."
exec "$@"
