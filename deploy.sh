#!/bin/bash

# ======================
# Deployment variables
# ======================
REMOTE_USER="ubuntu"                 # Remote server username
REMOTE_HOST="3.7.251.62"             # Remote server IP
REMOTE_APP_NAME="mts-backend"        # Docker container name
REMOTE_APP_DIR="~/mts-backend"       # Directory on remote server
REMOTE_PORT=3000                     # Port to expose
PEM_KEY="./web-server.pem"           # Path to your PEM key file

# SSH options
SSH_OPTS="-i $PEM_KEY -o StrictHostKeyChecking=no"

# ======================
# Helper function
# ======================
run_remote() {
  ssh $SSH_OPTS $REMOTE_USER@$REMOTE_HOST "$1"
}

# ======================
# Deployment process
# ======================
echo "🚀 Starting deployment to $REMOTE_HOST..."

# Step 1: Copy project files to server
echo "📦 Uploading project to server..."
ssh $SSH_OPTS $REMOTE_USER@$REMOTE_HOST "mkdir -p $REMOTE_APP_DIR"
scp $SSH_OPTS -r ./* $REMOTE_USER@$REMOTE_HOST:$REMOTE_APP_DIR

# Step 2: Build Docker image on the server
echo "🐳 Building Docker image on remote server..."
run_remote "cd $REMOTE_APP_DIR && docker build -t $REMOTE_APP_NAME ."

# Step 3: Stop and remove old container (if running)
echo "🛑 Stopping old container (if any)..."
run_remote "docker rm -f $REMOTE_APP_NAME || true"

# Step 4: Run the new container with environment variables
echo "🚢 Starting new container..."
run_remote "cd $REMOTE_APP_DIR && docker run -d --name $REMOTE_APP_NAME --env-file .env -p $REMOTE_PORT:3000 $REMOTE_APP_NAME"

echo "✅ Deployment complete!"
