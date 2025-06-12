FROM node:18-slim

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Environment variables will be provided by Railway
ENV SUPABASE_URL=
ENV SUPABASE_SERVICE_ROLE_KEY=
ENV DATABASE_URL=
ENV GOOGLE_GEMINI_API_KEY=

# Start the worker
CMD ["npm", "run", "start"] 