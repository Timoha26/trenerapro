FROM node:18.13-alpine as build
EXPOSE 80
EXPOSE 443

WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:stable-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist/trenerapro-app /usr/share/nginx/html
