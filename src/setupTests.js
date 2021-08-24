import crypto from 'crypto'
import '@testing-library/jest-dom/extend-expect'
import { mockGetSafeInfoResponse } from './logic/safe/utils/mocks/getSafeMock'

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

jest.mock('bnc-onboard', () =>
  jest.fn(() => ({
    config: jest.fn(),
    getState: jest.fn(),
    walletCheck: jest.fn(),
    walletReset: jest.fn(),
    walletSelect: jest.fn(), // returns true or false
  })),
)

export let mockedEndpoints = {
  getSafeInfo: jest.fn(),
}

jest.mock('@gnosis.pm/safe-react-gateway-sdk', () => {
  mockedEndpoints.getSafeInfo = jest.fn(() => new Promise((resolve) => resolve(mockGetSafeInfoResponse)))

  return {
    Operation: jest.fn(),
    TokenType: jest.fn(),
    TransactionStatus: jest.fn(),
    TransferDirection: jest.fn(),
    getBalances: jest.fn(),
    getCollectibles: jest.fn(),
    getFiatCurrencies: jest.fn(),
    getSafeInfo: mockedEndpoints.getSafeInfo,
    getTransactionDetails: jest.fn(),
    getTransactionHistory: jest.fn(),
    getTransactionQueue: jest.fn(),
    postTransaction: jest.fn(),
  }
})

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

beforeEach(() => {
  const location = { ...window.location }
  delete window.location
  window.location = {
    ...location,
    ...new URL('http://localhost/'), // Restore default location}
  }
})
