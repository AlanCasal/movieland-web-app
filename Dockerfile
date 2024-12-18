# Use Node.js 16 as base image
FROM node:16-slim

# Install Python 3.11 and required build dependencies
RUN apt-get update && apt-get install -y \
    python3.11 \
    python3-pip \
    python3-dev \
    build-essential \
    make \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Set Python 3.11 as default python and python3
RUN ln -sf /usr/bin/python3.11 /usr/bin/python3 && \
    ln -sf /usr/bin/python3.11 /usr/bin/python && \
    ln -sf /usr/bin/python3.11 /usr/local/bin/python

# Set working directory
WORKDIR /app

# Copy package files and .env file
COPY package*.json .env ./

# Replace node-sass with sass before install
RUN npm uninstall node-sass --save-dev && \
    npm install sass --save-dev

# Install dependencies using npm ci with Python path explicitly set
ENV PYTHON=/usr/bin/python3.11
RUN npm ci --no-optional

# Copy all app files
COPY . .

# Build the app
RUN npm run build

# Install serve to run the application
RUN npm install -g serve

# Expose port 3000
EXPOSE 3000

# Start the app
CMD ["serve", "-s", "build", "-l", "3000"] 