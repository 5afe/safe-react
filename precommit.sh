#!/bin/bash

STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep ".jsx\{0,1\}$")
ESLINT="$(git rev-parse --show-toplevel)/node_modules/.bin/eslint"

if [[ "$STAGED_FILES" = "" ]]; then
  exit 0
fi

PASS=true

echo -e "\nValidating Javascript:\n"

# Check for eslint
if [[ ! -x "$ESLINT" ]]; then
  echo -e "\t\033[41mPlease install ESlint\033[0m (npm i --save-dev eslint)"
  exit 1
fi

for FILE in $STAGED_FILES
do
  "$ESLINT" "$FILE" "--fix"

  if [[ "$?" == 0 ]]; then
    echo -e "\t\033[32mESLint Passed: $FILE\033[0m"
  else
    echo -e "\t\033[41mESLint Failed: $FILE\033[0m"
    PASS=false
  fi
done

echo -e "\nJavascript validation completed!\n"

if ! $PASS; then
  echo -e "\033[0;31mCOMMIT FAILED, PLEASE FIX ESLINT ERRORS:\033[0m Your commit contains files that should pass ESLint but do not. Please fix the ESLint errors in a new commit.\n"
  exit 1
else
  echo -e "\033[42mCOMMIT SUCCEEDED\033[0m\n"
fi

exit $?