FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (dev dependencies সহ)
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 5000

# Start server
CMD ["node", "server.js"]FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# npm ci (not npm install) installs exactly what's in package-lock.json —
# faster and fully reproducible. --omit=dev skips eslint/nodemon, which are
# never needed to run the server, keeping the image smaller and reducing
# its dependency/vulnerability surface.
RUN npm ci --omit=dev

# Copy source code
COPY . .

# Run as the non-root "node" user (built into the base image) instead of
# root inside the container.
USER node

# Expose port
EXPOSE 5000

# Start server
CMD ["node", "server.js"]
