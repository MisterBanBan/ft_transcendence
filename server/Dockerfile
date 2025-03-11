FROM node:18-alpine AS base

WORKDIR /node

# copy conf files
COPY package.json package-lock.json* ./

# Install dep
RUN npm install

# Install TypeScript globally
RUN npm install -g typescript

# Copy package.json and tsconfig.json first
COPY package*.json ./
COPY tsconfig.json ./

# Copy all source files
COPY . .

# Install Tailwind CSS
RUN npm install -D tailwindcss
RUN npx tailwindcss-cli@latest init -p


RUN npm install fastify @fastify/static

COPY . .

EXPOSE 3000

# Start server
CMD ["npm", "start"]
