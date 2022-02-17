import { ETHEREUM_NETWORK } from 'src/config/networks/network.d'
import { default as networks } from 'src/config/networks'

const { mainnet, alfajores } = networks

describe('Config Services', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it(`should load 'test' network config`, () => {
    // Given
    jest.mock('src/utils/constants', () => ({
      NODE_ENV: 'test',
    }))
    const { getNetworkInfo } = require('src/config')

    // When
    const networkInfo = getNetworkInfo()

    // Then
    expect(networkInfo.id).toBe(ETHEREUM_NETWORK.LOCAL)
  })

  it(`should load 'mainnet' network config`, () => {
    // Given
    jest.mock('src/utils/constants', () => ({
      NODE_ENV: '',
      NETWORK: 'MAINNET',
    }))
    const { getNetworkInfo } = require('src/config')

    // When
    const networkInfo = getNetworkInfo()

    // Then
    expect(networkInfo.id).toBe(ETHEREUM_NETWORK.MAINNET)
  })

  it(`should load 'mainnet.dev' network config`, () => {
    // Given
    jest.mock('src/utils/constants', () => ({
      NODE_ENV: '',
      NETWORK: 'MAINNET',
    }))
    const { getTxServiceUrl, getGnosisSafeAppsUrl } = require('src/config')
    const TX_SERVICE_URL = mainnet.environment.dev?.txServiceUrl

    // When
    const txServiceUrl = getTxServiceUrl()

    // Then
    expect(TX_SERVICE_URL).toBe(txServiceUrl)
  })

  it(`should load 'mainnet.staging' network config`, () => {
    // Given
    jest.mock('src/utils/constants', () => ({
      NODE_ENV: 'production',
      NETWORK: 'MAINNET',
    }))
    const { getTxServiceUrl } = require('src/config')
    const TX_SERVICE_URL = mainnet.environment.staging?.txServiceUrl

    // When
    const txServiceUrl = getTxServiceUrl()

    // Then
    expect(TX_SERVICE_URL).toBe(txServiceUrl)
  })

  it(`should load 'mainnet.production' network config`, () => {
    // Given
    jest.mock('src/utils/constants', () => ({
      NODE_ENV: 'production',
      NETWORK: 'MAINNET',
      APP_ENV: 'production',
    }))
    const { getTxServiceUrl, getGnosisSafeAppsUrl } = require('src/config')
    const TX_SERVICE_URL = mainnet.environment.production.txServiceUrl

    // When
    const txServiceUrl = getTxServiceUrl()

    // Then
    expect(TX_SERVICE_URL).toBe(txServiceUrl)
  })

  it(`should load 'alfajores.production' network config`, () => {
    // Given
    jest.mock('src/utils/constants', () => ({
      NODE_ENV: 'production',
      NETWORK: 'ALFAJORES',
      APP_ENV: 'production',
    }))
    const { getTxServiceUrl, getGnosisSafeAppsUrl } = require('src/config')
    const TX_SERVICE_URL = alfajores.environment.production.txServiceUrl

    // When
    const txServiceUrl = getTxServiceUrl()
    // Then
    expect(TX_SERVICE_URL).toBe(txServiceUrl)
  })

  it(`should default to 'alfajores.dev' network config if no environment is found`, () => {
    // Given
    jest.mock('src/utils/constants', () => ({
      NODE_ENV: '',
      NETWORK: 'ALFAJORES',
    }))
    const { getTxServiceUrl, getGnosisSafeAppsUrl } = require('src/config')
    const TX_SERVICE_URL = alfajores.environment.dev?.txServiceUrl

    // When
    const txServiceUrl = getTxServiceUrl()

    // Then
    expect(TX_SERVICE_URL).toBe(txServiceUrl)
  })
})
