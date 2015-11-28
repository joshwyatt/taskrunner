FROM node:latest
RUN mkdir /code
WORKDIR /code
ADD package.json /code
RUN npm install

ADD . /code

ENTRYPOINT ["node", "runner.js"]
