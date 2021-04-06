FROM node:14.10.1-alpine3.11 as build-deps

ENV PATH /usr/src/app/node_modules/.bin:$PATH
RUN apk add --no-cache python make g++

WORKDIR /usr/src/app
COPY    package.json yarn.lock ./
RUN     yarn
COPY    . .
RUN     yarn build

##########

# FROM gliderlabs/alpine:3.2
FROM alpine:3.13

ENV ENTRYKIT_VERSION 0.4.0
WORKDIR /

# Install Entrykit
RUN apk update
RUN apk add openssl \
  && rm -rf /var/cache/apk/* \
  && wget https://github.com/progrium/entrykit/releases/download/v${ENTRYKIT_VERSION}/entrykit_${ENTRYKIT_VERSION}_Linux_x86_64.tgz \
  && tar -xvzf entrykit_${ENTRYKIT_VERSION}_Linux_x86_64.tgz \
  && rm entrykit_${ENTRYKIT_VERSION}_Linux_x86_64.tgz \
  && mv entrykit /bin/entrykit \
  && chmod +x /bin/entrykit \
  && entrykit --symlink

RUN apk add nginx
RUN mkdir /run/nginx

COPY --from=build-deps /usr/src/app/build /usr/share/nginx/html
COPY ./contrib/docker/nginx.conf.tmpl     /etc/nginx/nginx.conf.tmpl
COPY ./contrib/env.js.tmpl                /usr/share/nginx/html/env.js.tmpl

ENTRYPOINT [ \
  "switch", \
    "shell=/bin/sh", \
    "version=nginx -v", "--", \
  "render", \
    "/etc/nginx/nginx.conf", \
    "/usr/share/nginx/html/env.js", \
    "--", \
    "/usr/sbin/nginx" \
]
