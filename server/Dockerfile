FROM node:18-alpine
WORKDIR /app
RUN ls -a
COPY package.json ./
COPY package-lock.json ./
RUN npm ci --silent
COPY . .
EXPOSE 3000