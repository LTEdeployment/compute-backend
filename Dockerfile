FROM node:6

RUN echo "deb http://cn.archive.ubuntu.com/ubuntu/ precise main universe" > /etc/apt/sources.list

RUN apt-get update --fix-missing && apt-get -y --force-yes upgrade && apt-get install -y --force-yes supervisor curl python-pip python-scipy && mkdir -p /var/log/supervisor
COPY ./dockerfiles/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

RUN pip install -i http://mirrors.aliyun.com/pypi/simple redis
RUN pip install -i http://mirrors.aliyun.com/pypi/simple pymongo

ADD . /app
WORKDIR /app
RUN npm install
ADD uploads /tmp/uploads

ENV NODE_ENV=prod
ENV CONFIG_BASEDIR=/configs
ENV CONFIG_DIR=compute-backend
CMD ["/usr/bin/supervisord"]
EXPOSE 8081
