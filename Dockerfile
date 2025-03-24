# Note: version here must match the engines.node version in package.json
FROM node:20.18.2-alpine

WORKDIR /usr/src/app

# Install wait-on so app start can be delayed until db is initialised
# Install nodemon for restart on file change
RUN npm install -g wait-on nodemon

COPY --chown=node:node package.json package-lock.json ./
# be specific about files to copy to prevent no required and/or risky files from being copied
# e.g. git, github, cloudfoundry files
COPY --chown=node:node server ./server/
COPY --chown=node:node test ./test/
COPY --chown=node:node index.js ./

ENV NODE_ENV=development
ENV TZ=Europe/London

RUN npm install --engine-strict

USER node

CMD [ "npm", "run", "start:local:no-watch" ]
