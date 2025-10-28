# =============================
# Stage 1: Builder
# =============================
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./

# Avoid peer conflicts during Docker builds
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

# =============================
# Stage 2: Runtime
# =============================
FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app ./

EXPOSE 3000
CMD ["npm", "start"]
