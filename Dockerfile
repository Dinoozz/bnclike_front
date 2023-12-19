# Étape 1: Construire l'application
FROM node:14 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install -g serve
RUN serve -s build
COPY . .

EXPOSE 80
CMD ["npm", "run", "build"]


