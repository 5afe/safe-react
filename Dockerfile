FROM node:14-slim as builder
WORKDIR /app
COPY . .
RUN apt update && apt install git -y
RUN yarn
RUN yarn build-mainnet


FROM nginx:stable-alpine-perl
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/
EXPOSE 80
