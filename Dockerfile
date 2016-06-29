# Start with official node image.
FROM node:6.1.0
MAINTAINER astronomer <greg@astronomer.io>

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
