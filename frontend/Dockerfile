# =============================
# Stage 1: Builder
# =============================
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./

# Avoid peer conflicts during Docker builds
RUN npm ci --silent

COPY . .
RUN npm run build

# =============================
# Stage 2: Runtime
# =============================
FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app ./

EXPOSE 3000
CMD ["npm", "start"]
