#!/bin/bash

function deploy_pull_request {
  REVIEW_ENVIRONMENT_DOMAIN='review.gnosisdev.com'

  # Pull request name with "pr" prefix
  PULL_REQUEST_NAME="pr$TRAVIS_PULL_REQUEST"

  # Feature name without all path. Example gnosis/pm-trading-ui -> pm-trading-ui
  REPO_NAME=$(basename $TRAVIS_REPO_SLUG)
  # Only alphanumeric characters. Example pm-trading-ui -> pmtradingui
  REPO_NAME_ALPHANUMERIC=$(echo $REPO_NAME | sed 's/[^a-zA-Z0-9]//g')

  # TRAVIS_PULL_REQUEST contains pull request number
  REVIEW_FEATURE_FOLDER="$REPO_NAME_ALPHANUMERIC/$PULL_REQUEST_NAME"

  # Deploy safe-team project
  aws s3 sync build s3://${REVIEW_BUCKET_NAME}/${REVIEW_FEATURE_FOLDER}/app --delete
}

function publish_pull_request_urls_in_github {
  REVIEW_FEATURE_URL="https://$PULL_REQUEST_NAME--$REPO_NAME_ALPHANUMERIC.$REVIEW_ENVIRONMENT_DOMAIN/app"

  # Using the Issues api instead of the PR api
  # Done so because every PR is an issue, and the issues api allows to post general comments,
  # while the PR api requires that comments are made to specific files and specific commits
  GITHUB_PR_COMMENTS=https://api.github.com/repos/${TRAVIS_REPO_SLUG}/issues/${TRAVIS_PULL_REQUEST}/comments
  curl -H "Authorization: token ${GITHUB_API_TOKEN}" --request POST ${GITHUB_PR_COMMENTS} --data '{"body":"Travis automatic deployment:\r\n '${REVIEW_FEATURE_URL}' \r\n"}'
}

# Only:
# - Pull requests
# - Security env variables are available. PR from forks don't have them.
if [ "$TRAVIS_PULL_REQUEST" != "false" ] && [ -n "$AWS_ACCESS_KEY_ID" ]
then
  deploy_pull_request
  publish_pull_request_urls_in_github
fi
