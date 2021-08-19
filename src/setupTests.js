import crypto from 'crypto'
import '@testing-library/jest-dom/extend-expect'

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

// to avoid failing tests in some environments
const NumberFormat = Intl.NumberFormat
const englishTestLocale = 'en'

jest.spyOn(Intl, 'NumberFormat').mockImplementation((locale, ...rest) => new NumberFormat([englishTestLocale], ...rest))

Object.defineProperty(window, 'crypto', {
  value: { getRandomValues: mockedGetRandomValues },
})
