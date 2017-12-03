FROM node:7.6

WORKDIR /app

COPY package.json /app
RUN  npm install --production
COPY . /app

EXPOSE 8080

RUN npm start

CMD ['echo', 'App start!']

