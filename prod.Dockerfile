FROM node:14 as react-build-step

# Grab needed environment variables from .env.example
ENV REACT_APP_ENV=production

RUN apt-get update \
    && apt-get install -y libusb-1.0-0 libusb-1.0-0-dev libudev-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json yarn.lock .
COPY src/logic/contracts/artifacts ./src/logic/contracts/artifacts

RUN yarn install

COPY . .

RUN yarn build

# Deploy the build
FROM nginx:1-alpine

COPY ./docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=react-build-step /app/build /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
