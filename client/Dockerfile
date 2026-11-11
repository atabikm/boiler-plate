# ==========================================
# BASE (development) — Vite dev server + hot reload
# Dipakai oleh docker-compose (target: base)
# ==========================================
FROM node:20-alpine AS base

WORKDIR /app

# Copy manifest dulu agar layer npm install ter-cache
COPY package*.json ./
RUN npm install --no-audit --no-fund

COPY . .

EXPOSE 3001

CMD ["npm", "run", "dev"]

# ==========================================
# PRODUCTION — build statis + serve via nginx
# Build: docker build --target production -t erp-client:prod .
# Run  : docker run -p 80:80 erp-client:prod
# ==========================================
FROM base AS build

RUN npm run build

FROM nginx:alpine AS production

# Konfigurasi nginx dengan SPA fallback (routing ditangani React Router)
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
