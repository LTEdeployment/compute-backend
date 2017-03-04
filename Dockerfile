FROM node
ADD . /src
WORKDIR /src
RUN npm install && npm install -g supervisor
ENV NODE_ENV prod

CMD ["node", "index.js"]
EXPOSE 9090
