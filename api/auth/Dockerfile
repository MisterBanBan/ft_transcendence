FROM node:20-alpine AS builder

RUN apk add --no-cache curl

WORKDIR /app

COPY package.json .
COPY tsconfig.json .
COPY src/ ./src

RUN npm install
RUN npm run build

FROM node:20-alpine

RUN apk add --no-cache curl

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY package.json .

RUN npm install --production

CMD ["node", "dist/server.js"]
