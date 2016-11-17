# Start with official node image.
FROM node:6.1.0
MAINTAINER astronomer <greg@astronomer.io>

RUN apt-get update && \
  apt-get install -y expect wget net-tools iproute ppp iptables traceroute vim && \
  rm -rf /var/lib/apt/lists/*

# Install fortivpn client unofficial .deb
RUN wget 'https://hadler.me/files/forticlient-sslvpn_4.4.2329-1_amd64.deb' -O forticlient-sslvpn_amd64.deb
RUN dpkg -x forticlient-sslvpn_amd64.deb /usr/share/forticlient

# Run setup
RUN /usr/share/forticlient/opt/forticlient-sslvpn/64bit/helper/setup.linux.sh 2

ADD forticlient /usr/local/bin/

# Add standard files on downstream builds.
ONBUILD ADD lib /usr/local/src/lib
ONBUILD ADD package.json /usr/local/src/
ONBUILD ADD .babelrc /usr/local/src/

# Switch to src dir and install node modules.
ONBUILD WORKDIR /usr/local/src
ONBUILD RUN ["npm", "install"]

# Execute task-runner installed with the activity with arguments provided from CMD.
# We might want to split out the executor and the utils into aries-executor and aries-utils.
ENTRYPOINT ["node_modules/.bin/aries-data"]
