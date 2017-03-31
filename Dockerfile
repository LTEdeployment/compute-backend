FROM ubuntu:16.04

ENV NPM_CONFIG_LOGLEVEL info
ENV NODE_VERSION 6.10.1

RUN echo "deb  http://cn.archive.ubuntu.com/ubuntu/ xenial main restricted universe multiverse" > /etc/apt/sources.list
RUN apt-get update --fix-missing && apt-get -y upgrade && apt-get install -y supervisor && apt-get install -y curl && mkdir -p /var/log/supervisor

RUN curl -SLO "https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.xz"
RUN tar -xJf "node-v$NODE_VERSION-linux-x64.tar.xz" -C /usr/local --strip-components=1 \
  && rm "node-v$NODE_VERSION-linux-x64.tar.xz"\
  && ln -s /usr/local/bin/node /usr/local/bin/nodejs

ENV YARN_VERSION 0.21.3

RUN set -ex \
  && for key in \
    6A010C5166006599AA17F08146C2130DFD2497F5 \
  ; do \
    gpg --keyserver ha.pool.sks-keyservers.net --recv-keys "$key"; \
  done \
  && curl -fSL -o yarn.js "https://yarnpkg.com/downloads/$YARN_VERSION/yarn-legacy-$YARN_VERSION.js" \
  && curl -fSL -o yarn.js.asc "https://yarnpkg.com/downloads/$YARN_VERSION/yarn-legacy-$YARN_VERSION.js.asc" \
  && gpg --batch --verify yarn.js.asc yarn.js \
  && rm yarn.js.asc \
  && mv yarn.js /usr/local/bin/yarn \
  && chmod +x /usr/local/bin/yarn


COPY ./dockerfiles/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

ADD . /compute-backend
WORKDIR /compute-backend
RUN npm install
ENV NODE_ENV=prod NODE_CONFIG_BASEDIR=/configs NODE_CONFIG_DIR=compute-backend

CMD ["/usr/bin/supervisord"]
EXPOSE 8081
