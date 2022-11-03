#!/bin/sh

echo 'Updating Jest mocks...'

# Fetch config
config=$(curl -s 'https://safe-client.staging.5afe.dev/v1/chains/')

# Pretty-print the JSON
node -p "JSON.stringify($config, null, 2)" > src/logic/safe/utils/mocks/remoteConfig.json
