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

RUN apk add --no-cache openssl

RUN mkdir -p /app/certs && \
  openssl req -x509 -newkey rsa:2048 -nodes \
  -keyout /app/certs/key.pem \
  -out /app/certs/cert.pem \
  -subj "/C=FR/ST=RA/L=Lyon/O=42/CN=localhost" \
  -days 365

RUN npm install --production

CMD ["node", "dist/server.js"]
