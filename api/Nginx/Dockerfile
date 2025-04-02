FROM nginx:alpine

RUN apk add --no-cache openssl

RUN mkdir -p /etc/nginx/ssl && \
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/key.key \
    -out /etc/nginx/ssl/certificate.crt \
    -subj "/C=FR/ST=RA/L=Lyon/O=42/CN=localhost"

COPY nginx.conf /etc/nginx/

CMD [ "nginx" ]