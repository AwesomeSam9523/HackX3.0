# ---------- Stage 1: Build ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies (use clean install for CI consistency)
COPY package*.json ./
RUN npm ci --silent

# Copy only necessary files for build
COPY tsconfig.json ./
COPY prisma ./prisma/
COPY . .

# Generate Prisma client and build the app
RUN npx prisma generate
RUN npm run build

# ---------- Stage 2: Run ----------
FROM node:20-alpine AS runner
WORKDIR /app

# Copy only the essential build output and Prisma client
COPY package*.json ./
RUN npm ci --omit=dev --silent

COPY prisma ./prisma/
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/dist ./dist

# Expose app ports
EXPOSE 5000
EXPOSE 9000

# Environment variables (override at runtime)
ENV NODE_ENV=production

# Run Prisma migrations before starting the server
CMD npx prisma migrate deploy && node dist/server.js
