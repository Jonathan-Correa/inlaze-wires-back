FROM node:14

WORKDIR /usr/src/app

COPY . .

EXPOSE 4200

CMD ["yarn", "dev"]
