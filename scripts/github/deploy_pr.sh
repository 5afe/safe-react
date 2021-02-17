#!/bin/bash

function deploy_pr {
  # Pull request number with "pr" prefix
  PULL_REQUEST_NUMBER="pr$PR_NUMBER"
  REVIEW_FEATURE_FOLDER="$REPO_NAME_ALPHANUMERIC/$PULL_REQUEST_NUMBER"
  APP_PATH="./build"
  echo REVIEW_BUCKET_NAME
  echo REVIEW_FEATURE_FOLDER
  
  # Deploy app project
  aws s3 sync $APP_PATH s3://${REVIEW_BUCKET_NAME}/${REVIEW_FEATURE_FOLDER}/app --delete
}

# Only:
# - Pull requests
# - Security env variables are available. PR from forks don't have them.
if [ -n "$AWS_SECRET_ACCESS_KEY" ]; then
  echo "Running the script"
    deploy_pr
fi