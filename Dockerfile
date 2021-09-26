FROM node:14 as builder

RUN apt-get update && apt-get install -y libusb-1.0-0 libusb-1.0-0-dev libudev-dev

WORKDIR /app

COPY . .

RUN yarn install
RUN yarn build

FROM node:14
WORKDIR "/app"
COPY --from=builder /app/build ./
RUN yarn global add serve
EXPOSE 5000

CMD ["serve", "-s", "./"]
