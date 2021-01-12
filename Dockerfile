# docker run -it --rm -v $HOME/.config/coin-check/config.toml:/root/.config/coin-check/config.toml coin-check
# docker run -it --rm -v $HOME/.config/coin-check/config.toml:/root/.config/coin-check/config.toml docker.pkg.github.com/mjohnsey/coin-check/coin-check:master

FROM node:13.7.0-stretch as builder
RUN apt-get update && apt-get install -y jq

WORKDIR /opt/app
# caching voodoo to cut down on build times
COPY package.json yarn.lock ./

RUN yarn --pure-lockfile

# Package the CLI
COPY . .
RUN yarn run oclif-dev pack -t "linux-x64"

# copy the output archive to a nice name
RUN export VERSION=$(cat package.json | jq -r '.version') && \
  test -n "$VERSION" && \
  cp "/opt/app/dist/coin-check-v${VERSION}/coin-check-v${VERSION}-linux-x64.tar.gz" /opt/app/export.tar.gz

FROM debian:10-slim
# need /etc/fonts for charting
RUN apt-get update && apt-get install -y fontconfig-config
WORKDIR /cli
COPY --from=builder "/opt/app/export.tar.gz" .
RUN tar -xvzf "/cli/export.tar.gz"
EXPOSE 8080/tcp
ENTRYPOINT [ "/cli/coin-check/bin/coin-check" ]
