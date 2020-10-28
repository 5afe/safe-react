import { ETHEREUM_NETWORK } from 'src/config/networks/network.d'
import { default as networks } from 'src/config/networks'

const { mainnet, xdai } = networks

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
    const SAFE_APPS_URL = mainnet.environment.dev?.safeAppsUrl

    // When
    const txServiceUrl = getTxServiceUrl()
    const safeAppsUrl = getGnosisSafeAppsUrl()

    // Then
    expect(TX_SERVICE_URL).toBe(txServiceUrl)
    expect(SAFE_APPS_URL).toBe(safeAppsUrl)
  })

  it(`should load 'mainnet.staging' network config`, () => {
    // Given
    jest.mock('src/utils/constants', () => ({
      NODE_ENV: 'production',
      NETWORK: 'MAINNET',
    }))
    const { getTxServiceUrl, getGnosisSafeAppsUrl } = require('src/config')
    const TX_SERVICE_URL = mainnet.environment.staging?.txServiceUrl
    const SAFE_APPS_URL = mainnet.environment.staging?.safeAppsUrl

    // When
    const txServiceUrl = getTxServiceUrl()
    const safeAppsUrl = getGnosisSafeAppsUrl()

    // Then
    expect(TX_SERVICE_URL).toBe(txServiceUrl)
    expect(SAFE_APPS_URL).toBe(safeAppsUrl)
  })

  it(`should load 'mainnet.production' network config`, () => {
    // Given
    jest.mock('src/utils/constants', () => ({
      NODE_ENV: 'production',
      NETWORK: 'MAINNET',
      APP_ENV: 'production'
    }))
    const { getTxServiceUrl, getGnosisSafeAppsUrl } = require('src/config')
    const TX_SERVICE_URL = mainnet.environment.production.txServiceUrl
    const SAFE_APPS_URL = mainnet.environment.production.safeAppsUrl

    // When
    const txServiceUrl = getTxServiceUrl()
    const safeAppsUrl = getGnosisSafeAppsUrl()

    // Then
    expect(TX_SERVICE_URL).toBe(txServiceUrl)
    expect(SAFE_APPS_URL).toBe(safeAppsUrl)
  })

  it(`should load 'xdai.production' network config`, () => {
    // Given
    jest.mock('src/utils/constants', () => ({
      NODE_ENV: 'production',
      NETWORK: 'XDAI',
      APP_ENV: 'production'
    }))
    const { getTxServiceUrl, getGnosisSafeAppsUrl } = require('src/config')
    const TX_SERVICE_URL = xdai.environment.production.txServiceUrl
    const SAFE_APPS_URL = xdai.environment.production.safeAppsUrl

    // When
    const txServiceUrl = getTxServiceUrl()
    const safeAppsUrl = getGnosisSafeAppsUrl()

    // Then
    expect(TX_SERVICE_URL).toBe(txServiceUrl)
    expect(SAFE_APPS_URL).toBe(safeAppsUrl)
  })

  it(`should default to 'xdai.production' network config if no environment is found`, () => {
    // Given
    jest.mock('src/utils/constants', () => ({
      NODE_ENV: '',
      NETWORK: 'XDAI',
    }))
    const { getTxServiceUrl, getGnosisSafeAppsUrl } = require('src/config')
    const TX_SERVICE_URL = xdai.environment.production.txServiceUrl
    const SAFE_APPS_URL = xdai.environment.production.safeAppsUrl

    // When
    const txServiceUrl = getTxServiceUrl()
    const safeAppsUrl = getGnosisSafeAppsUrl()

    // Then
    expect(TX_SERVICE_URL).toBe(txServiceUrl)
    expect(SAFE_APPS_URL).toBe(safeAppsUrl)
  })
})
