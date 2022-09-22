FROM node:16
WORKDIR /usr/src/app
COPY . .
RUN yarn install
WORKDIR /usr/src/app/shared
RUN yarn build
WORKDIR /usr/src/app/frontend
RUN yarn build
WORKDIR /usr/src/app/backend
EXPOSE 1500
CMD ["yarn", "start"]