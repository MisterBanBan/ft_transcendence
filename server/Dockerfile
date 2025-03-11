FROM node:18-alpine AS base

WORKDIR /node

# Copier les fichiers de configuration
COPY package.json package-lock.json* ./

# Installer les dépendances
RUN npm install

# Install TypeScript globally
RUN npm install -g typescript

# Copy package.json and tsconfig.json first
COPY package*.json ./
COPY tsconfig.json ./

# Copy all source files
COPY . .

# Installer Tailwind CSS
RUN npm install -D tailwindcss
RUN npx tailwindcss-cli@latest init -p

# Copier le reste du code source
COPY . .

# Exposer le port
EXPOSE 3000

# Démarrer le serveur
CMD ["npm", "start"]
