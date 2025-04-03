FROM node:20-alpine AS builder

WORKDIR /app

COPY tsconfig.json .
COPY package*.json .

COPY src/ ./src

RUN npm install && \
    npm run build

FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY package*.json .

RUN npm install --production

CMD ["node", "dist/index.js"]
