# Stage 1: Builder
FROM node:20-alpine AS builder
WORKDIR /app
# Install dependencies
COPY package.json yarn.lock* pnpm-lock.yaml* ./
RUN if [ -f yarn.lock ]; then yarn install --frozen-lockfile; elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm install --frozen-lockfile; else npm install; fi

# Copy source code and build the application
COPY . .
RUN npm run build

# Stage 2: Runner
FROM node:20-alpine AS runner
WORKDIR /app

# Copy the standalone output from the builder stage
# The standalone directory already includes a minimal node_modules
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public

# Set the production environment variable
ENV NODE_ENV=production
# Disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED=1

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]
