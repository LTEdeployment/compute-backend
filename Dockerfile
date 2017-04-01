FROM node:6

RUN apt-get update --fix-missing && apt-get -y upgrade && apt-get install -y supervisor && apt-get install -y curl && mkdir -p /var/log/supervisor
COPY ./dockerfiles/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

ADD . /compute-backend
WORKDIR /compute-backend
RUN npm install
ENV NODE_ENV=prod
CMD ["node", "index.js"]
EXPOSE 8081
