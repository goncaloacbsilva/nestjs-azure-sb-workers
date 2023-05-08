# ==== BUILD STAGE ====

FROM node:lts as builder

ENV NODE_ENV build

USER node
WORKDIR /home/node

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY --chown=node:node . .

# ==== PRODUCTION STAGE ====

FROM node:lts-slim

ENV NODE_ENV production

USER node
WORKDIR /home/node

COPY --from=builder --chown=node:node /home/node/package.json ./
COPY --from=builder --chown=node:node /home/node/yarn.lock ./
COPY --from=builder --chown=node:node /home/node/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /home/node/server.js ./server.js
COPY --from=builder --chown=node:node /home/node/express/ ./express/

# Expose API port
EXPOSE 8080

CMD ["node", "server.js"]