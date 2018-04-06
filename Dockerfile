ARG docker_username
ARG DOCKER_USERNAME

FROM node:9-alpine as frontend-react-builder

RUN env
RUN echo $docker_username
RUN echo $DOCKER_USERNAME

WORKDIR /app
RUN apk add --no-cache bash git
COPY ./frontend-react/package.json /app
COPY ./frontend-react/package-lock.json /app
ENV NODE_ENV production
RUN npm i
COPY ./frontend-react /app
RUN source vars-prod.sh; npm run build:prod

FROM node:9-alpine as frontend-ng-builder
WORKDIR /app
RUN apk add --no-cache bash git
COPY ./frontend-ng5/package.json /app
COPY ./frontend-ng5/package-lock.json /app
# ENV NODE_ENV production
RUN npm i
COPY ./frontend-ng5 /app
RUN source vars-prod.sh; npm run build:prod


FROM node:latest
WORKDIR /app

COPY ./backend/package-lock.json /app
COPY ./backend/package.json /app
ENV NODE_ENV production
RUN npm i

COPY ./backend /app
RUN mkdir www
COPY --from=frontend-react-builder /app/dist ./www/react
COPY --from=frontend-ng-builder /app/dist ./www/ng

CMD npm run start;
EXPOSE 10001

docker run --rm \
  -e PLUGIN_BUILD_ARGS='foo=bar,baz=boo' \
  -e TOP_SECRET=password \
  -e PLUGIN_BUILD_ARGS_FROM_ENV=top_secret \
  -e PLUGIN_TAG=latest \
  -e PLUGIN_REPO=octocat/hello-world \
  -e DRONE_COMMIT_SHA=d8dbe4d94f15fe89232e0402c6e8a0ddf21af3ab \
  -v $(pwd):$(pwd) \
  -w $(pwd) \
  --privileged \
  plugins/docker --dry-run
