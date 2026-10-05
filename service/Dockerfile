FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
COPY client/package.json client/package.json
COPY service/package.json service/package.json
RUN npm ci

COPY . .

EXPOSE 3000

CMD ["sh", "-c", "npm exec --workspace service prisma migrate deploy && npm exec --workspace service prisma generate && npm run dev --workspace service"]
