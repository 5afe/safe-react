// eslint-disable-next-line @typescript-eslint/no-var-requires
const { exec } = require('child_process')

const DEPLOYMENTS = {
  dev: 'https://safe-team.dev.gnosisdev.com/app',
  staging: 'https://safe-team.staging.gnosisdev.com/app',
  prod: 'https://gnosis-safe.io/app',
}

const command = `cypress ${process.argv[2]}`
const env = process.argv?.[3]

exec(env ? `${command} --config baseUrl=${DEPLOYMENTS[env]}` : command)
