import crypto from 'crypto'
import '@testing-library/jest-dom/extend-expect'
import * as sdkGatewayEndpoints from '@gnosis.pm/safe-react-gateway-sdk'
import { mockGetSafeInfoResponse } from './logic/safe/utils/mocks/getSafeMock'
import rinkeby from './config/networks/rinkeby'
import polygon from './config/networks/polygon'
import mainnet from './config/networks/mainnet'
import xdai from './config/networks/xdai'
import local from './config/networks/local'
import energy_web_chain from './config/networks/energy_web_chain'
import volta from './config/networks/volta'
import bsc from './config/networks/bsc'

function mockedGetRandomValues(buf) {
  if (!(buf instanceof Uint8Array)) {
    throw new TypeError('expected Uint8Array')
  }
  if (buf.length > 65536) {
    const e = new Error()
    e.message =
      "Failed to execute 'getRandomValues' on 'Crypto': The " +
      "ArrayBufferView's byte length (" +
      buf.length +
      ') exceeds the ' +
      'number of bytes of entropy available via this API (65536).'
    e.name = 'QuotaExceededError'
    throw e
  }
  const bytes = crypto.randomBytes(buf.length)
  buf.set(bytes)
}

jest.mock('bnc-onboard', () => () => ({
  config: jest.fn(),
  getState: jest.fn(),
  walletCheck: jest.fn(),
  walletReset: jest.fn(),
  walletSelect: jest.fn(), // returns true or false
}))

jest.mock('@gnosis.pm/safe-react-gateway-sdk', () => ({
  __esModule: true,
  Operation: jest.fn(),
  TokenType: jest.fn(),
  TransactionStatus: jest.fn(),
  TransferDirection: jest.fn(),
  getBalances: jest.fn(),
  getCollectibles: jest.fn(),
  getFiatCurrencies: jest.fn(),
  getSafeInfo: jest.fn(),
  getTransactionDetails: jest.fn(),
  getTransactionHistory: jest.fn(),
  getTransactionQueue: jest.fn(),
  postTransaction: jest.fn(),
}))

export let mockedEndpoints = {}

function mockAllEndpointsByDefault() {
  mockedEndpoints.getSafeInfo = sdkGatewayEndpoints.getSafeInfo.mockImplementation(
    () => new Promise((resolve) => resolve(mockGetSafeInfoResponse)),
  )
}

// to avoid failing tests in some environments
const NumberFormat = Intl.NumberFormat
const englishTestLocale = 'en'

jest.spyOn(Intl, 'NumberFormat').mockImplementation((locale, ...rest) => new NumberFormat([englishTestLocale], ...rest))

Object.defineProperty(window, 'crypto', {
  value: { getRandomValues: mockedGetRandomValues },
})

const DEFAULT_ENV = { ...process.env }

const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (/Warning.*not wrapped in act/.test(args[0])) {
      return
    }
    if (/Code 101: Failed to resolve the address \(Given address \"notExistingENSDomain.eth\" /.test(args[0])) {
      return
    }
    originalError.call(console, ...args)
  }
})

function clearAllMockRequest() {
  Object.keys(mockedEndpoints).forEach((endpoint) => {
    mockedEndpoints[endpoint].mockClear()
  })
}

afterEach(() => {
  process.env = { ...DEFAULT_ENV } // Restore default environment variables
  clearAllMockRequest()
})

const originalLocationHref = window.location.href

beforeEach(() => {
  mockAllEndpointsByDefault()
  window.location.href = originalLocationHref // Restore the url to http://localhost/
})

const mockRinkebyNetwork = {
  ...rinkeby,
  environment: {
    ...rinkeby.environment,
    test: {
      ...rinkeby.environment.dev,
      safeUrl: 'https://safe-test-fake-url.rinkeby.fake/app/',
    },
  },
}

const mockPolygonNetwork = {
  ...polygon,
  environment: {
    ...polygon.environment,
    test: {
      ...polygon.environment.dev,
      safeUrl: 'https://safe-test-fake-url.polygon.fake/app/',
    },
  },
}

const mockLocalNetwork = {
  ...local,
  environment: {
    ...local.environment,
    test: {
      ...local.environment.dev,
      safeUrl: 'https://safe-test-fake-url.local.fake/app/',
    },
  },
}

const mockMainnetNetwork = {
  ...mainnet,
  environment: {
    ...mainnet.environment,
    test: {
      ...mainnet.environment.dev,
      safeUrl: 'https://safe-test-fake-url.mainnet.fake/app/',
    },
  },
}

const mockXdaiNetwork = {
  ...xdai,
  environment: {
    ...xdai.environment,
    test: {
      ...xdai.environment.dev,
      safeUrl: 'https://safe-test-fake-url.xdai.fake/app/',
    },
  },
}

const mockEnergyWebChain = {
  ...energy_web_chain,
  environment: {
    ...energy_web_chain.environment,
    test: {
      ...energy_web_chain.environment.dev,
      safeUrl: 'https://safe-test-fake-url.energy_web_chain.fake/app/',
    },
  },
}

const mockVoltaChain = {
  ...volta,
  environment: {
    ...volta.environment,
    test: {
      ...volta.environment.dev,
      safeUrl: 'https://safe-test-fake-url.volta.fake/app/',
    },
  },
}

const mockBscChain = {
  ...bsc,
  environment: {
    ...bsc.environment,
    test: {
      ...bsc.environment.dev,
      safeUrl: 'https://safe-test-fake-url.bsc.fake/app/',
    },
  },
}

jest.mock('./config/networks', () => ({
  rinkeby: mockRinkebyNetwork,
  polygon: mockPolygonNetwork,
  local: mockLocalNetwork,
  xdai: mockXdaiNetwork,
  mainnet: mockMainnetNetwork,
  energy_web_chain: mockEnergyWebChain,
  volta: mockVoltaChain,
  bsc: mockBscChain,
}))
