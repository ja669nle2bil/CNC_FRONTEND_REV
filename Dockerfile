# Use Node.js for building the Expo app
FROM node:18 AS build
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npx install

# Copy the app's source code
COPY . .

# Build the app for web
RUN npx expo build:web

# Serve the build web app with NGINX
FROM nginx:stable-alpine AS production
COPY --from=build /app/web-build /usr/share/nginx/html

# Expose the default NGINX port
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]