#!/bin/bash

export NODE_ENV=production;

if [[ -n "$TRAVIS_TAG" ]]; then
    export REACT_APP_ENV='production';
elif [[ "$TRAVIS_BRANCH" == "development" ]];
    export NODE_ENV=development;
fi


yarn lint:check
yarn prettier:check
yarn build