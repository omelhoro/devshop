FROM node:alpine as frontend-react-kea-builder
WORKDIR /app
RUN apk add --no-cache bash git
COPY ./frontend-react/package.json /app
COPY ./frontend-react/package-lock.json /app
ENV NODE_ENV production
RUN npm i
COPY ./frontend-react /app
RUN source vars-prod.sh; npm run build


FROM node:alpine as frontend-react-context-builder
WORKDIR /app
RUN apk add --no-cache bash git
COPY ./frontend-react-context/package.json /app
COPY ./frontend-react-context/package-lock.json /app
ENV NODE_ENV production
RUN npm i
COPY ./frontend-react-context /app
RUN source vars-prod.sh; npm run build:prod

#
# FROM node:9-alpine as frontend-ng-builder
# WORKDIR /app
# RUN apk add --no-cache bash git
# COPY ./frontend-ng5/package.json /app
# COPY ./frontend-ng5/package-lock.json /app
# ENV NODE_ENV production
# RUN npm i
# COPY ./frontend-ng5 /app
# RUN source vars-prod.sh; npm run build:prod

# because of leveldb we need to use the complete node image (slim & alpine don't have python)
FROM node:10
WORKDIR /app
COPY ./backend/package-lock.json /app
COPY ./backend/package.json /app
ENV NODE_ENV production
RUN npm i
COPY ./backend /app
COPY --from=frontend-react-kea-builder /app/dist ./www/react-kea
COPY --from=frontend-react-context-builder /app/dist ./www/react-context
# COPY --from=frontend-ng-builder /app/dist ./www/ng

CMD npm run start;
EXPOSE 10001
