# Multi-stage mechanism that allows to build the application in a "builder" 
# stage and then create a lightweight production image containing the 
# required dependencies and the JS build files.

# ==== BUILD STAGE ====

FROM node:lts as builder

ENV NODE_ENV build

USER node
WORKDIR /home/node

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY --chown=node:node . .

RUN yarn build

# ==== PRODUCTION STAGE ====

FROM node:lts-slim

ENV NODE_ENV production

USER node
WORKDIR /home/node

COPY --from=builder --chown=node:node /home/node/package.json ./
COPY --from=builder --chown=node:node /home/node/yarn.lock ./
COPY --from=builder --chown=node:node /home/node/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /home/node/dist/ ./dist/

# No need to expose ports since the communication is made through the Azure SB

CMD ["node", "dist/main.js"]