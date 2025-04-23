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

RUN mkdir -p /etc/nginx/ssl

RUN mkdir -p /var/run/nginx

RUN apk add --no-cache nginx openssl bash

RUN mkdir -p /etc/nginx/ssl && \
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/key.key \
    -out /etc/nginx/ssl/certificate.crt \
    -subj "/C=FR/ST=RA/L=Lyon/O=42/CN=localhost"

COPY nginx.conf /etc/nginx/
COPY src/css/ /usr/share/nginx/front/css/
COPY src/img/ /usr/share/nginx/front/img/
COPY src/error_page /usr/share/nginx/front/error_page/
COPY src/index.html /usr/share/nginx/front/

COPY --from=builder /app/dist /usr/share/nginx/front/public/
COPY package.json .

RUN npm install --production

CMD [ "nginx" ]