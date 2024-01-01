# Base node image --------------------------------------------------------------
FROM node:18-alpine AS base

# https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

# Install openssl and SQlite for Prisma
RUN apk add --no-cache openssl
RUN apk add --no-cache sqlite
RUN npm install -g prisma

# Install sharp for image Next.js image optimization
RUN npm install -g sharp

# Install all node_modules, including dev dependencies -------------------------
FROM base AS deps
WORKDIR /app

ADD package.json package-lock.json .npmrc ./
RUN npm install --include=dev

# Setup production node_modules ------------------------------------------------
FROM base AS production-deps
WORKDIR /app

COPY --from=deps /app/node_modules /app/node_modules
ADD package.json package-lock.json .npmrc ./
RUN npm prune --omit=dev

# Build the app and generate Prisma client -------------------------------------
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules /app/node_modules

ADD prisma .
RUN npx prisma generate

ADD . .
ARG APP_ENV=production
ENV APP_ENV=${APP_ENV}
RUN npm run build

# Production image, copy all the files and run next ----------------------------
FROM base AS runner

# In production the custom Next.js server handles both HTTP and WS requests
ENV DATABASE_URL=file:/data/sqlite.db
ENV NODE_ENV="production"

# Disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app

COPY --from=production-deps /app/node_modules /app/node_modules
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/start.sh ./start.sh
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/dist ./dist

EXPOSE 3000

ENTRYPOINT [ "./start.sh" ]
