FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY tsconfig.json ./
COPY prisma ./prisma/
COPY . .

RUN npx prisma generate
RUN npm run build
ENV DATABASE_URL="postgresql://postgres:root@localhost:5432/mujhackx?schema=public"
EXPOSE 5000
EXPOSE 9000

CMD npx prisma migrate deploy
CMD node dist/server.js
