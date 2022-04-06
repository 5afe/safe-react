const rl = require('readline')
const { exec } = require('child_process')

const DEPLOYMENTS = {
  d: 'https://safe-team.dev.gnosisdev.com/app',
  s: 'https://safe-team.staging.gnosisdev.com/app',
  p: 'https://gnosis-safe.io/app',
}

const readline = rl.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const cmd = `cypress ${process.argv[2]}`

function launchCypressEnv() {
  readline.question(
    'Which environment do you want to test: (l)ocal, (d)evelopment, (s)taging or (p)roduction? ',
    ([env = 'l']) => {
      const key = env.toLowerCase()

      if (key === 'l') {
        exec(cmd)
      } else if (Object.keys(DEPLOYMENTS).includes(key)) {
        exec(`${cmd} --config baseUrl=${DEPLOYMENTS[key]}`)
      } else {
        console.log(`\nInvalid environment.`)
      }

      readline.close()
    },
  )
}

launchCypressEnv()
