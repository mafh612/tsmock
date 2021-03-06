FROM node:12-alpine AS base
USER node
RUN mkdir -p /home/node/build
RUN mkdir -p /home/node/app

FROM base AS build
ENV NODE_ENV=development
WORKDIR /home/node/build
COPY --chown=node:node . .
RUN yarn && yarn build

# FROM build AS test
# ENV NODE_ENV=test
# RUN yarn test

FROM build AS release
ENV NODE_ENV=production
WORKDIR /home/node/app
COPY view view
COPY --from=build /home/node/build/dist .
ARG openapifile="__assets__/test.yaml"
COPY ${openapifile} ./openapi.yaml
ENTRYPOINT ["node", "bin.js"]
CMD ["node", "bin.js", "openapi.yaml"]
