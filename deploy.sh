#!/bin/bash

# Variables
REMOTE_USER="ubuntu"                # Your server username
REMOTE_HOST="3.7.251.62"           # Your server IP
REMOTE_APP_NAME="mts-backend"       # Name for your Docker container
LOCAL_IMAGE_NAME="mts-backend:latest" # Docker image tag locally
REMOTE_IMAGE_NAME="mts-backend:latest" # Docker image tag on server
REMOTE_PORT=3000                     # Port to expose

# Build Docker image locally
echo "Building Docker image..."
docker build -t $LOCAL_IMAGE_NAME .

# Copy image to remote server
echo "Saving and sending image to server..."
docker save $LOCAL_IMAGE_NAME | ssh $REMOTE_USER@$REMOTE_HOST "docker load"

# Stop existing container (if running) and remove it
echo "Stopping existing container (if any)..."
ssh $REMOTE_USER@$REMOTE_HOST "docker rm -f $REMOTE_APP_NAME || true"

# Run new container
echo "Starting new container..."
ssh $REMOTE_USER@$REMOTE_HOST "docker run -d --name $REMOTE_APP_NAME -p $REMOTE_PORT:3000 $REMOTE_IMAGE_NAME"

echo "Deployment complete!"
