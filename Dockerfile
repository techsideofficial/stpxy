FROM node:lts-alpine

LABEL version="1.0"
LABEL maintainer="Platforme <development@platforme.com>"

EXPOSE 8080

ENV LEVEL INFO
ENV HOST 0.0.0.0
ENV PORT 8080
ENV NODE_ENV production

ADD app.js /app/
ADD package.json /app/
ADD lib /app/lib

WORKDIR /app

RUN apk update &&\
    npm install

CMD ["/usr/bin/node", "/app/app.js"]
