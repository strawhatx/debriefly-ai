# Use Node.js LTS version
FROM node:20-slim

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm ci --only=production

# Bundle app source
COPY . .

# Set environment variables
ENV NODE_ENV=production \
    SUPABASE_URL="" \
    SUPABASE_SERVICE_ROLE_KEY="" \
    GOOGLE_GEMINI_API_KEY=""

# Start the worker
CMD [ "npm", "start" ] 