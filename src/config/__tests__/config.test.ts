import { ETHEREUM_NETWORK } from 'src/config/networks/network.d'
import { default as networks } from 'src/config/networks'

const { mainnet, xdai } = networks

const mainnetShortName = mainnet.network.shortName
const xDaiShortName = xdai.network.shortName

const validSafeAddress = '0x57CB13cbef735FbDD65f5f2866638c546464E45F'

describe('Config Services', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it(`should load 'test' network config`, () => {
    // Given
    const { getNetworkInfo } = require('src/config')

    // When
    const networkInfo = getNetworkInfo()

    // Then
    expect(networkInfo.id).toBe(ETHEREUM_NETWORK.RINKEBY)
  })

  it(`should load 'mainnet' network config`, () => {
    // Given
    jest.mock('src/utils/constants', () => ({
      NODE_ENV: '',
    }))
    window.history.pushState(null, '', `${window.location.origin}/app/${mainnetShortName}:${validSafeAddress}`)
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
    }))
    window.history.pushState(null, '', `${window.location.origin}/app/${mainnetShortName}:${validSafeAddress}`)
    const { getTxServiceUrl } = require('src/config')
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
    }))
    window.history.pushState(null, '', `${window.location.origin}/app/${mainnetShortName}:${validSafeAddress}`)
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
      APP_ENV: 'production',
    }))
    window.history.pushState(null, '', `${window.location.origin}/app/${mainnetShortName}:${validSafeAddress}`)
    const { getTxServiceUrl } = require('src/config')
    const TX_SERVICE_URL = mainnet.environment.production.txServiceUrl

    // When
    const txServiceUrl = getTxServiceUrl()

    // Then
    expect(TX_SERVICE_URL).toBe(txServiceUrl)
  })

  it(`should load 'xdai.production' network config`, () => {
    // Given
    jest.mock('src/utils/constants', () => ({
      NODE_ENV: 'production',
      APP_ENV: 'production',
    }))
    window.history.pushState(null, '', `${window.location.origin}/app/${xDaiShortName}:${validSafeAddress}`)
    const { getTxServiceUrl } = require('src/config')
    const TX_SERVICE_URL = xdai.environment.production.txServiceUrl

    // When
    const txServiceUrl = getTxServiceUrl()
    // Then
    expect(TX_SERVICE_URL).toBe(txServiceUrl)
  })

  it(`should default to 'xdai.dev' network config if no environment is found`, () => {
    // Given
    jest.mock('src/utils/constants', () => ({
      NODE_ENV: '',
    }))
    window.history.pushState(null, '', `${window.location.origin}/app/${xDaiShortName}:${validSafeAddress}`)
    const { getTxServiceUrl } = require('src/config')
    const TX_SERVICE_URL = xdai.environment.dev?.txServiceUrl

    // When
    const txServiceUrl = getTxServiceUrl()

    // Then
    expect(TX_SERVICE_URL).toBe(txServiceUrl)
  })
})
