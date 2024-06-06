# Dockerfile for the frontend
FROM node:16.13.2-alpine as build

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY frontend/package*.json ./
COPY tsconfig.base.json ./

RUN npm install

# Bundle app source
COPY . .
RUN npm run build

# Stage 2: Serve app with nginx server
FROM nginx:1.21.5-alpine as release
COPY --from=build /usr/src/app/dist /usr/share/nginx/html
COPY frontend/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]