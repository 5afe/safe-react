import { getStoragePrefix } from '..'

describe('getStoragePrefix', () => {
  it('saves a stringified value', () => {
    expect(getStoragePrefix('137')).toBe('_immortal|v2_POLYGON__')
    expect(getStoragePrefix('4')).toBe('_immortal|v2_RINKEBY__')
    expect(getStoragePrefix('1')).toBe('_immortal|v2_MAINNET__')
    expect(getStoragePrefix('100')).toBe('_immortal|v2_XDAI__')
    expect(getStoragePrefix('246')).toBe('_immortal|v2_ENERGY_WEB_CHAIN__')
    expect(getStoragePrefix('9358392457')).toBe('_immortal|v2_9358392457__')
    expect(getStoragePrefix()).toBe('_immortal|v2_RINKEBY__')
  })
})
