FROM node:14.17-alpine as builder

ENV NODE_ENV build

WORKDIR /home/node

COPY . /home/node

RUN npm ci \
    && npm run build \
    && npm prune --production

# ---

FROM node:14.17-alpine

ENV NODE_ENV production
ENV DATABASE_USERNAME=root
ENV DATABASE_PASSWORD=toor
ENV DATABASE_HOST=xxclusterxx.jmfa3.mongodb.net
ENV DATABASE_NAME=tp01

USER node
WORKDIR /home/node

COPY --from=builder /home/node/package*.json /home/node/
COPY --from=builder /home/node/node_modules/ /home/node/node_modules/
COPY --from=builder /home/node/dist/ /home/node/dist/

CMD ["node", "dist/apps/rest-api/main.js"]