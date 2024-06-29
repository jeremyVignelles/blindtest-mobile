# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/{server,game,admin}

# install the server as production mode because we only need to run it
COPY package.json bun.lockb /temp/server/
RUN cd /temp/server && bun install --frozen-lockfile --production

# install the game and admin as development mode because we need to build them
COPY admin/package.json admin/bun.lockb /temp/admin/
COPY game/package.json game/bun.lockb /temp/game/
RUN cd /temp/admin && bun install --frozen-lockfile && \
    cd /temp/game && bun install --frozen-lockfile

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS builder
RUN apt-get update && apt-get install -y procps && rm -rf /var/lib/apt/lists/*
COPY --from=install /temp/admin/node_modules admin/node_modules
COPY --from=install /temp/game/node_modules game/node_modules
COPY common ./common
COPY game ./game
COPY admin ./admin

# build the game and admin
RUN cd /usr/src/app/admin && bun run build-only && \
    cd /usr/src/app/game && bun run build-only

# copy production dependencies and source code into final image
FROM base AS release
COPY --from=install /temp/server/node_modules node_modules
COPY tsconfig.json package.json *.ts .
COPY common ./common
COPY sockets ./sockets
COPY --from=builder /usr/src/app/dist dist
RUN ls -al

# run the app
USER bun
EXPOSE 8080/tcp
ENTRYPOINT [ "bun", "run", "index.ts" ]