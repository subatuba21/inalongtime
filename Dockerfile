FROM node:16
WORKDIR /usr/src/app
COPY . .
RUN npm install
WORKDIR /usr/src/app/shared
RUN npm run build
WORKDIR /usr/src/app/frontend
RUN npm run build
WORKDIR /usr/src/app/backend
EXPOSE 1500
CMD ["npm", "start"]