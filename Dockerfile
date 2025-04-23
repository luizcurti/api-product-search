FROM node:20 AS build

WORKDIR /home/node/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:20

WORKDIR /home/node/app

COPY --from=build /home/node/app/dist /home/node/app/dist
COPY --from=build /home/node/app/node_modules /home/node/app/node_modules
COPY --from=build /home/node/app/package*.json ./

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "dist/server.js"]
