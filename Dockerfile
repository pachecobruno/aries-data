FROM astronomerio/aries:1.0.1
MAINTAINER astronomer <greg@astronomer.io>

# Install node.js
ENV NODE_VERSION=6.9.2-r1

RUN apk --update upgrade \
    && apk add --no-cache \
        git \
        nodejs=$NODE_VERSION

ONBUILD WORKDIR /usr/local/src

# copy package.json and install modules
ONBUILD COPY package.json .
ONBUILD RUN ["npm", "install"]

# Add standard files on downstream builds.
# Add lib and test last to use docker layer caching for previous layers
# especially npm install. Avoids downstream images needing to run npm install
# on every change to lib or test files
ONBUILD COPY .babelrc .
ONBUILD COPY .eslintrc .
ONBUILD COPY lib lib
ONBUILD COPY test test

# Execute task-runner installed with the activity with arguments provided from CMD.
# We might want to split out the executor and the utils into aries-executor and aries-utils.
ENTRYPOINT ["node_modules/.bin/aries-data"]
