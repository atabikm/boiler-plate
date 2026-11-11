# ==========================================
# BASE — dependensi + Prisma Client
# Dipakai bersama oleh stage development & production
# ==========================================
FROM node:20-slim AS base

WORKDIR /app

# OpenSSL dibutuhkan engine Prisma di debian slim
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copy manifest dulu agar layer npm install ter-cache
# (image hanya di-rebuild jika package.json berubah)
COPY package*.json ./
RUN npm install --no-audit --no-fund

COPY . .

# Generate Prisma Client dari schema.prisma
RUN npx prisma generate

# ==========================================
# DEVELOPMENT — hot reload dengan tsx watch
# Dipakai oleh docker-compose (target: development)
# Entry point lengkap ada di docker-entrypoint.sh:
# npm install -> prisma generate -> migrate deploy -> seed -> start
# ==========================================
FROM base AS development

ENV NODE_ENV=development
EXPOSE 5001

CMD ["npm", "run", "dev"]

# ==========================================
# PRODUCTION — compile TS -> JS, jalankan node murni
# Build: docker build --target production -t erp-server:prod .
# Run  : docker run -e DATABASE_URL=... -p 5001:5001 erp-server:prod
# ==========================================
FROM base AS production

ENV NODE_ENV=production
RUN npm run build

EXPOSE 5001

# Migrasi dijalankan otomatis sebelum server naik (aman & idempotent)
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
