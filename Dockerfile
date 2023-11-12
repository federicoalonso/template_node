FROM node:20-alpine

ENV NEW_RELIC_NO_CONFIG_FILE=true \
NEW_RELIC_LOG=stdout \
NEW_RELIC_SLOW_SQL_ENABLED=true \
NEW_RELIC_APP_NAME=svc_game 

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 4001

CMD ["npm", "start"]
