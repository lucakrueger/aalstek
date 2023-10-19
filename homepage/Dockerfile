FROM node:14.17.0-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

RUN cp prod.env .env

CMD [ "npm", "start"]