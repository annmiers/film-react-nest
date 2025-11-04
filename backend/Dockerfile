FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

COPY public ./public

RUN npm run build

RUN npm prune --production

CMD ["node", "dist/main"]