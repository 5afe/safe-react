import * as migrationUtils from '../utils'

jest.mock('src/logic/exceptions/CodedException', () => {
  // Require the original module to not be mocked...
  const originalModule = jest.requireActual('src/logic/exceptions/CodedException')

  return {
    __esModule: true, // Use it when dealing with esModules
    ...originalModule,
    trackError: jest.fn(),
  }
})

// Only exported functions
describe('getSubdomainUrl', () => {
  // production
  it('returns the correct production url', () => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { hostname: 'gnosis-safe.io' },
    })

    const subdomain = migrationUtils.getSubdomainUrl('rinkeby')
    expect(subdomain).toEqual('https://rinkeby.gnosis-safe.io/app')
  })

  it('returns nothing for incorrect staging url', () => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { hostname: 'fake.url' },
    })

    const subdomain = migrationUtils.getSubdomainUrl('rinkeby')
    expect(subdomain).toEqual('')
  })

  // staging
  it('returns the correct staging url', () => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { hostname: 'safe-team-mainnet.staging.gnosisdev.com' },
    })

    const subdomain = migrationUtils.getSubdomainUrl('bsc')
    expect(subdomain).toEqual('https://safe-team-bsc.staging.gnosisdev.com/app')
  })
})

describe('addMigratedNetwork', () => {
  it('should not add already migrated network', () => {
    Object.defineProperty(window, 'localStorage', {
      writable: true,
      value: { getItem: jest.fn(() => JSON.stringify(['rinkeby'])), setItem: jest.fn() },
    })

    migrationUtils.addMigratedNetwork('rinkeby')
    expect(localStorage.setItem).not.toHaveBeenCalled()
  })
  it('should add newly migrated network', () => {
    Object.defineProperty(window, 'localStorage', {
      writable: true,
      value: { getItem: jest.fn(() => JSON.stringify(['xdai'])), setItem: jest.fn() },
    })

    migrationUtils.addMigratedNetwork('rinkeby')
    expect(localStorage.setItem).toHaveBeenCalledWith('SAFE__migratedNetworks', JSON.stringify(['xdai', 'rinkeby']))
  })
})

describe('getNetworksToMigrate', () => {
  it('returns all networks when no localStorage value exists', () => {
    Object.defineProperty(window, 'localStorage', {
      writable: true,
      value: { getItem: jest.fn(() => null) },
    })

    const networks = migrationUtils.getNetworksToMigrate()
    expect(networks).toEqual(['bsc', 'polygon', 'ewc', 'rinkeby', 'xdai'])
  })
  it('returns non-migrated networks', () => {
    Object.defineProperty(window, 'localStorage', {
      writable: true,
      value: { getItem: jest.fn(() => JSON.stringify(['bsc', 'rinkeby'])) },
    })

    const networks = migrationUtils.getNetworksToMigrate()
    expect(networks).toEqual(['polygon', 'ewc', 'xdai'])
  })
  it('returns an empty array when all networks are migrated', () => {
    Object.defineProperty(window, 'localStorage', {
      writable: true,
      value: { getItem: jest.fn(() => JSON.stringify(['polygon', 'ewc', 'rinkeby', 'xdai', 'bsc'])) },
    })

    const networks = migrationUtils.getNetworksToMigrate()
    expect(networks).toEqual([])
  })
})

describe('isNetworkSubdomain', () => {
  it('returns true if subdomain', () => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        href: 'https://rinkeby.gnosis-safe.io/app/#/safes/0xb3b83bf204C458B461de9B0CD2739DB152b4fa5A/balances',
        hostname: 'rinkeby.gnosis-safe.io',
      },
    })

    expect(migrationUtils.isNetworkSubdomain()).toBe(true)
  })
  it('returns false if not subdomain', () => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { href: 'https://gnosis-safe.io/app/welcome', hostname: 'gnosis-safe.io' },
    })

    expect(migrationUtils.isNetworkSubdomain()).toBe(false)
  })
})
describe('handleMessage', () => {
  let addressBookCallbackMock
  let immortalDataCallbackMock

  beforeEach(() => {
    addressBookCallbackMock = jest.fn()
    immortalDataCallbackMock = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return if not a valid origin', () => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { hostname: 'google.com' },
    })

    const eventMock = {
      data: {
        payload: '',
      },
      origin: 'gnosis-safe.io',
    } as MessageEvent
    const addressBookCallbackMock = jest.fn()
    const immortalDataCallbackMock = jest.fn()

    migrationUtils.handleMessage(eventMock, addressBookCallbackMock, immortalDataCallbackMock)

    expect(addressBookCallbackMock).not.toHaveBeenCalled()
    expect(immortalDataCallbackMock).not.toHaveBeenCalled()
  })
  it('should return if there is a completely malformed payload', () => {
    const exceptions = require('src/logic/exceptions/CodedException')
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { hostname: 'gnosis-safe.io' },
    })

    Object.defineProperty(window, 'origin', {
      writable: true,
      value: 'https://gnosis-safe.io',
    })

    const eventMock = {
      data: {
        payload: 'isdufhgoisdfuhglsdf',
      },
      origin: 'https://rinkeby.gnosis-safe.io',
    } as MessageEvent

    migrationUtils.handleMessage(eventMock, addressBookCallbackMock, immortalDataCallbackMock)

    expect(addressBookCallbackMock).not.toHaveBeenCalled()
    expect(immortalDataCallbackMock).not.toHaveBeenCalled()
    expect(exceptions.trackError).toHaveBeenCalled()
  })
  it('should not try to merge the address book if the address book payload is malformed', () => {
    Object.defineProperty(window, 'localStorage', {
      writable: true,
      value: { setItem: jest.fn(), getItem: jest.fn() },
    })

    const exceptions = require('src/logic/exceptions/CodedException')

    Object.defineProperty(window, 'location', {
      writable: true,
      value: { hostname: 'gnosis-safe.io' },
    })

    Object.defineProperty(window, 'origin', {
      writable: true,
      value: 'https://gnosis-safe.io',
    })

    const eventMock = {
      data: {
        payload: JSON.stringify({
          SAFE__addressBook: 'sdfiguhfdoshgudslf',
          ['_immortal|v2_RINKEBY']: JSON.stringify({ test: 'aisfdhoilsaf' }),
        }),
      },
      origin: 'https://rinkeby.gnosis-safe.io',
    } as MessageEvent

    migrationUtils.handleMessage(eventMock, addressBookCallbackMock, immortalDataCallbackMock)

    expect(addressBookCallbackMock).not.toHaveBeenCalled()
    expect(exceptions.trackError).toHaveBeenCalledTimes(1)
    expect(immortalDataCallbackMock).toHaveBeenCalledWith('v2_RINKEBY', { test: 'aisfdhoilsaf' })
  })
  it('should not save localStorage data if the localStorage payload is malformed', () => {
    Object.defineProperty(window, 'localStorage', {
      writable: true,
      value: { setItem: jest.fn(), getItem: jest.fn() },
    })

    const exceptions = require('src/logic/exceptions/CodedException')

    Object.defineProperty(window, 'location', {
      writable: true,
      value: { hostname: 'gnosis-safe.io' },
    })

    Object.defineProperty(window, 'origin', {
      writable: true,
      value: 'https://gnosis-safe.io',
    })

    const eventMock = {
      data: {
        payload: JSON.stringify({
          SAFE__addressBook: JSON.stringify([]),
          ['_immortal|v2_RINKEBY']: 'sdifughosidfghdfgs',
        }),
      },
      origin: 'https://rinkeby.gnosis-safe.io',
    } as MessageEvent

    migrationUtils.handleMessage(eventMock, addressBookCallbackMock, immortalDataCallbackMock)

    expect(addressBookCallbackMock).toHaveBeenCalledWith([])
    expect(immortalDataCallbackMock).not.toHaveBeenCalled()
    expect(exceptions.trackError).toHaveBeenCalledTimes(1)
  })
  it('should migrate correctly formed address book/localStorage data', () => {
    Object.defineProperty(window, 'localStorage', {
      writable: true,
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
      },
    })

    Object.defineProperty(window, 'location', {
      writable: true,
      value: { hostname: 'gnosis-safe.io' },
    })

    Object.defineProperty(window, 'origin', {
      writable: true,
      value: 'https://gnosis-safe.io',
    })

    const eventMock = {
      data: {
        payload: JSON.stringify({
          SAFE__addressBook: JSON.stringify([]),
          ['_immortal|v2_RINKEBY']: JSON.stringify({}),
        }),
      },
      origin: 'https://rinkeby.gnosis-safe.io',
    } as MessageEvent

    migrationUtils.handleMessage(eventMock, addressBookCallbackMock, immortalDataCallbackMock)

    expect(addressBookCallbackMock).toHaveBeenCalledWith([])
    expect(immortalDataCallbackMock).toHaveBeenCalledWith('v2_RINKEBY', {})
  })
})
