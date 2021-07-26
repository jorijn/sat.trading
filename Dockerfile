FROM node:15-alpine AS build

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn

COPY . ./

RUN yarn build

FROM nginx:1.21.1-alpine AS final

COPY --from=build /usr/src/app/dist /usr/share/nginx/html
