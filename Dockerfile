FROM node:14-alpine AS build

# Create app directory
RUN mkdir -p /app
WORKDIR /app

# Set a default value for PUBLIC_URL
ARG PUBLIC_URL="/"
ENV PUBLIC_URL=$PUBLIC_URL

# Install app dependencies
COPY package.json /app
COPY yarn.lock /app
RUN yarn --network-timeout 100000 --network-concurrency 1

# Bundle app source
COPY . /app/
RUN yarn build

# Copy build into new smaller docker container
FROM nginx:1.14-alpine
COPY --from=build /app/build /var/www
COPY nginx.conf /etc/nginx/nginx.conf
COPY scripts/run-nginx.sh ./
COPY config /usr/share/nginx/config/
EXPOSE 80
CMD ./run-nginx.sh
