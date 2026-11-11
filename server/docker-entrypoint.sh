#!/bin/sh
# ==========================================
# ENTRY POINT SERVER (development)
# Urutan startup yang dijamin berjalan setiap container naik:
#   1. Sinkronisasi dependensi  (package.json berubah? cukup restart, tanpa rebuild)
#   2. Generate Prisma Client   (schema.prisma berubah? otomatis ter-generate)
#   3. Apply migrasi            (prisma migrate deploy — hanya menerapkan migrasi baru)
#   4. Seed database            (idempotent — aman dijalankan berulang kali)
#   5. Start server             (tsx watch, hot reload)
# ==========================================
set -e

echo "==> [1/5] Sinkronisasi dependensi..."
npm install --no-audit --no-fund

echo "==> [2/5] Generate Prisma Client..."
npx prisma generate

echo "==> [3/5] Apply database migrations..."
npx prisma migrate deploy

echo "==> [4/5] Seed database (idempotent)..."
npx prisma db seed

echo "==> [5/5] Starting server..."
exec "$@"
