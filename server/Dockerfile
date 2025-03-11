FROM node:18-alpine AS base

WORKDIR /node

# Copier les fichiers de configuration
COPY package.json package-lock.json* ./

# Installer les dépendances
RUN npm install

# Installer Tailwind CSS
RUN npm install -D tailwindcss postcss autoprefixer
RUN npx tailwindcss-cli@latest init -p

# Copier le reste du code source
COPY . .

# Exposer le port
EXPOSE 3000

# Démarrer le serveur
CMD ["npm", "start"]
