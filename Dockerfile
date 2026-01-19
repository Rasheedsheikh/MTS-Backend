# Use Node 20 Alpine as base
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for NestJS build)
RUN npm ci

# Copy the rest of the source code
COPY . .

# Build the application
RUN npm run build

# Expose application port
EXPOSE 3000

# Run the built app
CMD ["node", "dist/main"]
