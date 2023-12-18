FROM node:lts-alpine

WORKDIR /app

COPY . .

EXPOSE 3000

CMD [ "node", "server.js", "--http=0.0.0.0:3000" ]