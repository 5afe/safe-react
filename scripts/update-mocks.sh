#!/bin/sh

echo 'Updating Jest mocks...'

curl 'https://safe-client.staging.gnosisdev.com/v1/chains/' > src/logic/safe/utils/mocks/remoteConfig.json
