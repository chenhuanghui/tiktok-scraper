# Use an official Node.js runtime as a parent image
FROM node:18-slim

# Install required system dependencies for Selenium and Chrome
RUN apt-get update && apt-get install -y \
    wget \
    unzip \
    libnss3 \
    fonts-liberation \
    libappindicator3-1 \
    libxss1 \
    xdg-utils \
    libatk-bridge2.0-0 \
    libgtk-3-0 \
    libxcomposite1 \
    libxrender1 \
    libxcb1 \
    libx11-xcb1 \
    libxcursor1 \
    libxrandr2 \
    libdbus-glib-1-2 \
    libasound2 \
    google-chrome-stable \
    --no-install-recommends && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy project files
COPY . .

# Install Playwright dependencies and Chromium for testing
RUN npx playwright install-deps && npx playwright install chromium

# Expose port 3000 for the app
EXPOSE 3000

# Start the app
CMD ["npm", "start"]