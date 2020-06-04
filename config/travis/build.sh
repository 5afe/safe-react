#!/bin/bash

export NODE_ENV=production;

if [[ -n "$TRAVIS_TAG" ]]; then export REACT_APP_ENV='production'; fi

yarn lint:check
yarn prettier:check
travis_wait 15 yarn build