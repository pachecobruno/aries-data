#!/usr/bin/bash

# strip leading v for docker tags
DOCKER_TAG=$(echo $CIRCLE_TAG | cut -c 2-)

# retag latest as DOCKER_TAG
docker tag $IMAGE_NAME:latest $IMAGE_NAME:$DOCKER_TAG

# login to docker and push image
docker login -e $DOCKER_EMAIL -u $DOCKER_USER -p $DOCKER_PASS
docker push $IMAGE_NAME:$DOCKER_TAG

# publish aries to npm
npm publish
