# Pinning specific version for stability
# Using slim for reduced image size
FROM node:18-bullseye-slim AS builder

WORKDIR /app
# Copy only files required to install
# dependencies to better layer caching
COPY . .
RUN npm install
RUN npm run build

FROM node:18-bullseye-slim AS production

ENV NODE_ENV production
WORKDIR /usr/src/app

COPY package*.json ./
# Install only production dependencies
# Using cache mount to speed up install of existing dependencies
# Install PM2 to manager the process of node, restarting if app crashs
RUN --mount=type=cache,target=/usr/src/app/.npm \
  npm set cache /usr/src/app/.npm && \
  npm ci --only=production && \
  npm install pm2 -g

# Use non-root user
USER node

# Copy the healthcheck script
COPY --chown=node:node ./healthcheck/ .

# Copy remaining source code after installing dependencies. 
# Again, copy only the necessary files

COPY --from=builder --chown=node:node ./app/dist/src .

# Indicate expected port
EXPOSE 5000

HEALTHCHECK --interval=60s --timeout=30s --start-period=30s \  
    CMD node healthcheck.js

CMD [ "pm2-runtime", "index.js" ]