# Stage 1: Install dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Stage 2: Build the application
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# prisma.config.ts requires DATABASE_URL even for `generate` (no DB connection made)
ARG DATABASE_URL=postgresql://placeholder:placeholder@localhost:5432/placeholder
ENV DATABASE_URL=${DATABASE_URL}
# Generate Prisma client (outputs to generated/prisma/)
RUN npx prisma generate
# Build Next.js
RUN npm run build

# Stage 3: Production runner (lean image)
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy only what next start needs
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["npm", "start"]
