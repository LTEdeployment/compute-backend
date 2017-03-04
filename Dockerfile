FROM node
ADD . /compute-backend
WORKDIR /compute-backend
RUN npm install && npm install -g supervisor
ENV NODE_ENV prod
ADD /home/xhinliang/config/local.json  /compute-backend/config/local.json
ADD /home/xhinliang/config/prod.json  /compute-backend/config/prod.json
ADD /home/xhinliang/config/dev.json  /compute-backend/config/dev.json
ADD /home/xhinliang/config/default.json  /compute-backend/config/default.json

CMD ["node", "index.js"]
EXPOSE 9090
