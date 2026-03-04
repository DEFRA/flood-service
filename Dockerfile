ARG PARENT_VERSION=2.10.3-node22.21.1

FROM defradigital/node:${PARENT_VERSION} AS base
ARG PORT=3000
ENV PORT=${PORT}

USER root

# set -xe : -e abort on error : -x verbose output
RUN set -xe \
  && apk update && apk upgrade \
  && rm -rf /var/cache/apk/*

# Create app directory
WORKDIR /home/node/app

# Copy the basic directories/files across
# When developing/debugging within a container locally, --chown=root:root should be replaced with --chown=node:node to provide
# required write permissions. SonarQube cloud will raise a security issue if analysing these changes.
COPY --chown=root:root package*.json .
COPY --chown=root:root ./index.js .
COPY --chown=root:root ./server ./server

ARG BUILD_VERSION=v8.23.0-1-g6666666
ARG GIT_COMMIT=0
RUN echo -e "module.exports = { version: '$BUILD_VERSION', revision: '$GIT_COMMIT' }" > ./version.js

FROM base AS development

# Copy test resources
# When developing/debugging within a container locally, --chown=root:root should be replaced with --chown=node:node to provide
# required write permissions. SonarQube cloud will raise a security issue if analysing these changes.
COPY --chown=root:root ./test ./test

RUN npm ci --engine-strict --ignore-scripts --include=dev

USER node
EXPOSE ${PORT}/tcp
EXPOSE 9229/tcp
CMD [ "node", "--inspect=0.0.0.0:9229", "index.js" ]

FROM base AS production 

RUN npm ci --engine-strict --ignore-scripts --omit=dev \
&& chmod -R a-w /home/node

USER node
EXPOSE ${PORT}/tcp
CMD [ "node", "index.js" ]
