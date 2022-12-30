FROM node:18-alpine
WORKDIR /app
# RUN ls -a
# COPY package.json ./
# COPY package-lock.json ./
COPY server ./
RUN npm ci --silent
EXPOSE 4000