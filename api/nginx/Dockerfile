FROM node:20-alpine AS builder

RUN apk add --no-cache curl

WORKDIR /app

COPY package.json .
COPY tsconfig.json .
COPY tailwind.config.js .
COPY postcss.config.js .
COPY src/ ./src

# Installer les dépendances, y compris Tailwind CSS
RUN npm uninstall tailwindcss --if-present
RUN npm install tailwindcss@3.3.3 postcss autoprefixer --save-dev
RUN npm install

# Créer le fichier CSS Tailwind avant la construction principale
RUN npx tailwindcss -i ./src/css/input.css -o ./src/css/output.css

# Construire l'application
RUN npm run build

FROM node:20-alpine

RUN apk add --no-cache curl

WORKDIR /app

RUN mkdir -p /etc/nginx/ssl

RUN mkdir -p /var/run/nginx

RUN apk add --no-cache nginx openssl bash

#RUN mkdir -p /etc/nginx/ssl && \
#    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
#    -keyout ./certs/key.key \
#    -out ./certs/cert.crt \
#    -subj "/C=FR/ST=RA/L=Lyon/O=42/CN=localhost" \
#    -addext "subjectAltName=IP:10.14.8.1,IP:127.0.0.1,DNS:localhost"

COPY nginx.conf /etc/nginx/
COPY src/css/ /usr/share/nginx/front/css/
COPY src/img/ /usr/share/nginx/front/img/
COPY src/index.html /usr/share/nginx/front/

COPY --from=builder /app/src/css/ /usr/share/nginx/front/css/
COPY --from=builder /app/dist /usr/share/nginx/front/public/
COPY package.json .

RUN npm install --production

CMD [ "nginx" ]