FROM node:20

# Install Chromium dependencies
RUN apt-get update && apt-get install -y \
    wget \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    libu2f-udev \
    libnss3 \
    libxss1 \
    libgbm1 \
    libgtk-3-0 \
    libxshmfence1 \
    --no-install-recommends && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package and install
COPY package*.json ./
RUN npm install

RUN npm install -g pm2 html-to-pdf

# Copy source
COPY . .

# Expose port if needed
EXPOSE 4000

CMD ["pm2-runtime", "index.js"]