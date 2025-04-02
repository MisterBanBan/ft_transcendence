FROM node:latest AS build

COPY app/ app/
WORKDIR /app
RUN npm install
RUN	npm run build

FROM node:20.9.0-bullseye-slim

COPY --from=build /app /app
WORKDIR /app
CMD ["node", "dist/server.js"]