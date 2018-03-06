FROM node:9-alpine as frontend-builder
WORKDIR /app
RUN apk add --no-cache bash git

COPY ./frontend/package.json /app
COPY ./frontend/package-lock.json /app
ENV NODE_ENV production
RUN npm i

COPY ./frontend /app
RUN source vars-prod.sh; npm run build

FROM node:latest
WORKDIR /app

COPY ./backend/package-lock.json /app
COPY ./backend/package.json /app
ENV NODE_ENV production
RUN npm i

COPY ./backend /app
COPY --from=frontend-builder /app/dist ./dist

CMD npm run start;
EXPOSE 10001
