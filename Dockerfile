FROM node:18.16-alpine3.17 as builder

# Create app directory
RUN mkdir /app
WORKDIR /app

# Install app dependencies
COPY ./package.json /app

RUN npm install --force

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "serve"]