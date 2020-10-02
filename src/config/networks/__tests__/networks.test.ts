import fs from 'fs'

import networks from 'src/config/networks'
import { ETHEREUM_NETWORK } from 'src/logic/wallets/getWeb3'
import { isValidURL } from 'src/utils/url'

describe('Networks config files test', () => {
  const environments = ['dev', 'staging', 'production']

  const NETWORKS_PATH = 'src/config/networks/'
  const configFiles = fs.readdirSync(NETWORKS_PATH)
  const networksFileNames = configFiles
    .filter((file) => !fs.lstatSync(`${NETWORKS_PATH}${file}`).isDirectory())
    .filter((file) => {
      const [fileName, extension] = file.split('.')
      return extension === 'ts' && fileName !== 'index'
    })
    .map((file) => file.split('.')[0])

  it(`should verify that the network file is exported in the networks/index.ts file`, () => {
    networksFileNames.forEach((networkFileName) => {
      const isValid = !!networks[networkFileName]

      if (!isValid) {
        console.log(`Network file "${networkFileName}" is not exported in "networks/index.ts"`)
      }

      expect(isValid).toBeTruthy()
    })
  })

  environments.forEach((environment) => {
    networksFileNames.forEach((networkFileName) => {
      it(`should validate "${environment}" environment URIs for ${networkFileName} config`, () => {
        // Given
        const networkConfig = networks[networkFileName]

        // When
        const networkConfigElement = networkConfig.environment[environment]
        if (!networkConfigElement) {
          return
        }

        const environmentConfigKeys = Object
          .keys(networkConfigElement)
          .filter((environmentConfigKey) =>
            environmentConfigKey.endsWith('Uri') && !!networkConfigElement[environmentConfigKey]
          )

        // Then
        environmentConfigKeys.forEach((environmentConfigKey) => {
          const networkConfigElementUri = networkConfigElement[environmentConfigKey]
          const isValid = isValidURL(networkConfigElementUri)

          if (!isValid) {
            console.log(`Invalid URI in "${networkFileName}" at ${environment}.${environmentConfigKey}:`, networkConfigElementUri)
          }

          expect(isValid).toBeTruthy()
        })
      })
    })
  })

  networksFileNames.forEach((networkFileName) => {
    it(`should have a valid 'decimal' value for 'nativeToken'`, () => {
      // Given
      const networkConfig = networks[networkFileName]

      // When
      const { decimals } = networkConfig.network.nativeCoin

      // Then
      const isValid = Number.isInteger(decimals) && decimals >= 0

      if (!isValid) {
        console.log(`Invalid value in "${networkFileName}" at network.decimals:`, decimals)
      }

      expect(isValid).toBeTruthy()
    })
  })

  networksFileNames.forEach((networkFileName) => {
    it(`should have one of 'ETHEREUM_NETWORK' values for 'network.id'`, () => {
      // Given
      const networkConfig = networks[networkFileName]

      // When
      const { id } = networkConfig.network

      // Then
      const isValid = ETHEREUM_NETWORK[id]

      if (!isValid) {
        console.log(`Invalid value in "${networkFileName}" at network.id:`, id)
      }

      expect(isValid).toBeTruthy()
    })
  })

  networksFileNames.forEach((networkFileName) => {
    it(`should have a valid CSS color defined for 'network.color'`, () => {
      // Given
      const networkConfig = networks[networkFileName]

      // When
      const { color } = networkConfig.network

      // Then
      const s = new Option().style
      s.color = color
      const isValid = s.color !== ''

      if (!isValid) {
        console.log(`Invalid value in "${networkFileName}" at network.color:`, color)
      }

      expect(isValid).toBeTruthy()
    })
  })
})
