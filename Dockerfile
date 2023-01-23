# Install dependencies only when needed
FROM node:19 AS ui-build
USER root
WORKDIR /usr/src/app

# Install and build client dependencies
COPY client/ ./client/
COPY shared/ ./shared/
RUN cd client && npm ci && npm run build

USER $NON_ROOT_USER_ID

# Install and build server dependencies
FROM node:19 AS server-build
USER root
WORKDIR /usr/src/app
COPY server/ ./server/
COPY shared/ ./shared/
RUN cd server && npm ci && npm run build-dist
USER $NON_ROOT_USER_ID

# If using npm comment out above and use below instead
# RUN npm run build

# Production image, copy all the files and run next
FROM node:19 AS runner
USER root

# Copy client dist and server dist and start the serever 
WORKDIR /usr/src/app
COPY --from=ui-build /usr/src/app/client/dist ./client/dist
COPY --from=server-build /usr/src/app/server/dist ./server/dist
COPY --from=server-build /usr/src/app/server/node_modules ./server/node_modules
USER $NON_ROOT_USER_ID

RUN ls

EXPOSE 5001

ENV PORT 5001

CMD ["node", "./server/dist/server/src/server.js"]