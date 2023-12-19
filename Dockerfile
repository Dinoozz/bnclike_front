# Étape 1: Construire l'application
FROM node:14 AS build
WORKDIR /app
COPY package*.json ./
COPY . .
RUN npm install

EXPOSE 80
CMD ["npm", "run build"]


