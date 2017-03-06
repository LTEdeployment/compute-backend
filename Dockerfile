FROM node
ADD . /compute-backend
WORKDIR /compute-backend
RUN npm install
ENV NODE_ENV=prod NODE_CONFIG_BASEDIR=/configs NODE_CONFIG_DIR=compute-backend

CMD ["node", "index.js"]
EXPOSE 8081
