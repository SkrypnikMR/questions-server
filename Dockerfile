# Используйте Node.js версии 14 в качестве базового образа
FROM node:14


WORKDIR /usr/src/app


COPY package*.json ./


RUN npm install

COPY . .


RUN npm run build


RUN npm install -g @nestjs/cli


CMD ["npm", "run", "start:prod"]