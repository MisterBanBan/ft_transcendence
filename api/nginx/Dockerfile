FROM node:18-alpine as build-stage

WORKDIR /app

# Copier les fichiers de configuration
COPY package*.json ./
COPY vite.config.js ./
COPY tsconfig*.json ./

# Installer les dépendances
RUN npm ci

# Copier TOUS les fichiers du projet
COPY . .

# Construire l'application
RUN npm run build

FROM nginx:alpine
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
