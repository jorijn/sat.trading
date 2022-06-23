FROM node:16-alpine AS build

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn

COPY . ./

RUN yarn build

FROM nginx:1.23.0-alpine AS final

COPY --from=build /usr/src/app/dist /usr/share/nginx/html
