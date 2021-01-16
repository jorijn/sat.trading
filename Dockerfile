FROM node:14 AS build

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn

COPY . ./

RUN yarn build

FROM bitnami/nginx:1.18.0 AS final

COPY --from=build /usr/src/app/dist /app
