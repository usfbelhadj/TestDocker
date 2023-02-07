# FROM docker.registry-private.hbtn.io/ubuntu_2004
# MAINTAINER Vincent ROESSLE <vincent.roessle@holbertonschool.com>

FROM ubuntu


ENV DEBIAN_FRONTEND noninteractive
ENV GECKODRIVER_VER v0.30.0
ENV FIREFOX_VER 91.0
 
# sqdsqd
RUN sed -i "s/archive.ubuntu.com/us.archive.ubuntu.com/" /etc/apt/sources.list
RUN apt clean && apt autoclean
RUN apt-get update 

RUN apt-get install -y curl
RUN apt-get install -y wget

RUN curl -sl https://deb.nodesource.com/setup_18.x -o nodesource_setup.sh
RUN bash nodesource_setup.sh
RUN apt-get install -y nodejs

RUN npm install semistandard --global
RUN npm install request --global
RUN npm install base-64 --global
RUN npm install utf8 --global

# Add latest FireFox
RUN apt-get update \
    && apt-get install -y --force-yes --no-install-recommends dbus-x11 firefox curl \
    && apt-get install build-essential chrpath libssl-dev libxft-dev -y \
    && apt-get install libfreetype6 libfreetype6-dev -y \
    && apt-get install libfontconfig1 libfontconfig1-dev -y \
    && apt-get install libasound2 -y \
    && apt-get autoclean \
    && apt-get autoremove \
	&& rm -rf /var/lib/apt/lists/*

# Install nodejs
RUN apt-get install -y nodejs \
    && apt-get autoclean \
    && apt-get autoremove \
	&& rm -rf /var/lib/apt/lists/*

VOLUME /opt/node/node_modules

# Insatll Firefox required libraries
RUN apt install firefox

# Add geckodriver


# install google chrome
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list'
RUN apt-get -y update
RUN apt-get install -y google-chrome-stable

# install chromedriver
RUN apt-get install -yqq unzip
RUN wget -O /tmp/chromedriver.zip http://chromedriver.storage.googleapis.com/`curl -sS chromedriver.storage.googleapis.com/LATEST_RELEASE`/chromedriver_linux64.zip
RUN unzip /tmp/chromedriver.zip chromedriver -d /usr/local/bin/
   
# Setting up selenium node requirements
RUN npm install -g selenium-webdriver
RUN npm install -g create-react-app
RUN npm install --save react react-dom
ENV NODE_PATH /usr/local/lib/node_modules

WORKDIR /
# Installing libraries
RUN mkdir /tmp/node_packages
COPY package.json /tmp/node_packages/package.json
RUN cd /tmp/node_packages && npm install -g 

# STEPS
COPY react /react/
COPY test.js /react/
WORKDIR /react/
RUN npm start &
RUN node test.js