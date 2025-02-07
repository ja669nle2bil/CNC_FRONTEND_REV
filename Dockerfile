# Usage of Node.js for building the Expo app base image
FROM node:18-alpine

# Set the working dir.
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the app's source code
COPY . .

# Install EXPO CLI globally
RUN npm install -g expo-cli

# Expose the default port + EXPO services
EXPOSE 8081 19000 19001 19002

# Default command for running the app
CMD ["npx", "expo", "start", "-w", "-c", "--lan"]