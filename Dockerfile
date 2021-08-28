FROM node:14-alpine

WORKDIR ./
COPY ./dist ./app
COPY package*.json ./
RUN npm ci --only=prod && rm -f .npmrc

CMD ["node", "app"]
