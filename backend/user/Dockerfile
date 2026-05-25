# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --prefer-offline --no-audit

COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache dumb-init

# Copy only necessary artifacts
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev --prefer-offline --no-audit && \
    npm cache clean --force

ENV NODE_ENV=production
EXPOSE 3002

RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
USER nodejs

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main.js"]
