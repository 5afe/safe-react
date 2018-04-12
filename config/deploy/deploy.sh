
#!/bin/bash

echo "Deployment script for gnosis-safe-team"

RANGE=500

number=$RANDOM
let "number %= $RANGE"

# Split on "/", ref: http://stackoverflow.com/a/5257398/689223
REPO_SLUG_ARRAY=(${TRAVIS_REPO_SLUG//\// })
REPO_OWNER=${REPO_SLUG_ARRAY[0]}
REPO_NAME=${REPO_SLUG_ARRAY[1]}

DEPLOY_PATH=./build_webpack
DEPLOY_PATH_STORYBOOK=./build_storybook

DEPLOY_SUBDOMAIN_UNFORMATTED_LIST=()

if [ "$TRAVIS_PULL_REQUEST" != "false" ]
then
  if [ "$NODE_ENV" == "production" ]
  then
    DEPLOY_SUBDOMAIN_UNFORMATTED_LIST+=(release-${TRAVIS_PULL_REQUEST}-pr-${number})
  else
    DEPLOY_SUBDOMAIN_UNFORMATTED_LIST+=(staging-${TRAVIS_PULL_REQUEST}-pr-${number})
  fi
elif [ -n "${TRAVIS_TAG// }" ] #TAG is not empty
then
  if [ "$NODE_ENV" == "production" ]
  then

    #sorts the tags and picks the latest
    #sort -V does not work on the travis machine
    #sort -V              ref: http://stackoverflow.com/a/14273595/689223
    #sort -t ...          ref: http://stackoverflow.com/a/4495368/689223
    #reverse with sed     ref: http://stackoverflow.com/a/744093/689223
    #git tags | ignore release candidates | sort versions | reverse | pick first line
    LATEST_TAG=`git tag | grep -v rc | sort -t. -k 1,1n -k 2,2n -k 3,3n -k 4,4n | sed '1!G;h;$!d' | sed -n 1p`
    echo $LATEST_TAG

    if [ "$TRAVIS_TAG" == "$LATEST_TAG" ]
    then
      DEPLOY_SUBDOMAIN_UNFORMATTED_LIST+=(latest)
    fi

    DEPLOY_SUBDOMAIN_UNFORMATTED_LIST+=(${TRAVIS_TAG}-tag)
  fi
else
  DEPLOY_SUBDOMAIN_UNFORMATTED_LIST+=(${TRAVIS_BRANCH}-branch)
fi

for DEPLOY_SUBDOMAIN_UNFORMATTED in "${DEPLOY_SUBDOMAIN_UNFORMATTED_LIST[@]}"
do
  echo $DEPLOY_SUBDOMAIN_UNFORMATTED

  # replaces non alphanumeric symbols with "-"
  # sed -r is only supported in linux, ref http://stackoverflow.com/a/2871217/689223
  # Domain names follow the RFC1123 spec [a-Z] [0-9] [-]
  # The length is limited to 253 characters
  # https://en.wikipedia.org/wiki/Domain_Name_System#Domain_name_syntax
  DEPLOY_SUBDOMAIN=`echo "$DEPLOY_SUBDOMAIN_UNFORMATTED" | sed -r 's/[^A-Za-z0-9]+/\-/g'`
  echo $DEPLOY_SUBDOMAIN

  DEPLOY_DOMAIN=https://${DEPLOY_SUBDOMAIN}-${REPO_NAME}-${REPO_OWNER}.surge.sh
  DEPLOY_STORYBOOK=https://storybook-${DEPLOY_SUBDOMAIN}-${REPO_NAME}-${REPO_OWNER}.surge.sh

  surge --project ${DEPLOY_PATH} --domain $DEPLOY_DOMAIN;
  surge --project ${DEPLOY_PATH_STORYBOOK} --domain $DEPLOY_STORYBOOK
  
  if [ "$TRAVIS_PULL_REQUEST" != "false" ]
  then
    # Using the Issues api instead of the PR api
    # Done so because every PR is an issue, and the issues api allows to post general comments,
    # while the PR api requires that comments are made to specific files and specific commits
    GITHUB_PR_COMMENTS=https://api.github.com/repos/${TRAVIS_REPO_SLUG}/issues/${TRAVIS_PULL_REQUEST}/comments
    curl -H "Authorization: token ${GITHUB_API_TOKEN}" --request POST ${GITHUB_PR_COMMENTS} --data '{"body":"Travis automatic deployment:\r\n '${DEPLOY_DOMAIN}' \r\n \r\n Storybook book automatic deployment: \r\n '${DEPLOY_STORYBOOK}'"}'
  fi
done

echo "Deploy domain: ${DEPLOY_DOMAIN}"