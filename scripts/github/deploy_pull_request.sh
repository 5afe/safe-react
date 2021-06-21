#!/bin/bash

function deploy_pull_request {
  # Pull request number with "pr" prefix
  PULL_REQUEST_NUMBER="pr$PR_NUMBER"

  # Only alphanumeric characters. Example safe-react -> safereact
  REVIEW_FEATURE_FOLDER="$REPO_NAME_ALPHANUMERIC/$PULL_REQUEST_NUMBER"

  # App build path
  APP_PATH="./build"

  # Deploy pull request
  aws s3 sync $APP_PATH s3://${REVIEW_BUCKET_NAME}/${REVIEW_FEATURE_FOLDER}/${REACT_APP_NETWORK}/app --delete
}

# Only:
# - Pull requests
# - Security env variables are available. PR from forks don't have them.
if [ -n "$AWS_ACCESS_KEY_ID" ]; then
    deploy_pull_request
fi
