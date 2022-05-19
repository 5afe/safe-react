FROM node:10-buster-slim

RUN apt-get update && apt-get install -yqq --no-install-recommends \
    build-essential ca-certificates git python2 pkg-config libusb-1.0-0-dev libudev-dev

USER node
WORKDIR /home/node

COPY package*.json yarn.lock ./
RUN yarn install
COPY . ./
RUN yarn build-mainnet
