FROM node:6

RUN echo "deb http://cn.archive.ubuntu.com/ubuntu/ precise main universe" > /etc/apt/sources.list

RUN apt-get update --fix-missing && apt-get -y --force-yes upgrade && apt-get install -y --force-yes supervisor curl python-pip python-scipy && mkdir -p /var/log/supervisor
COPY ./dockerfiles/supervisord.conf /etc/supervisor/conf.d/supervisord.conf


ADD . /compute-backend
WORKDIR /compute-backend
RUN npm install
RUN pip install -i https://pypi.tuna.tsinghua.edu.cn/simple -r services/requirements.txt
ENV NODE_ENV=prod
CMD ["node", "index.js"]
EXPOSE 8081
