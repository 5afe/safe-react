import { getStoragePrefix } from '..'

describe('getStoragePrefix', () => {
  it('saves a stringified value', () => {
    expect(getStoragePrefix('137')).toBe('_immortal|v2_POLYGON__')
    expect(getStoragePrefix('9358392457')).toBe('_immortal|v2_9358392457__')
    expect(getStoragePrefix()).toBe('_immortal|v2_RINKEBY__')
  })
})
