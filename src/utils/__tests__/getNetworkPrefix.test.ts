import getNetworkPrefix from '../getNetworkPrefix'

describe('getNetworkPrefix', () => {
  it('Returns a network prefix from a given address', () => {
    const prefixedAddress = 'rin:0xbAddaD0000000000000000000000000000000001'
    const prefix = getNetworkPrefix(prefixedAddress)

    expect(prefix).toBe('rin')
  })

  it('Returns an empty string if no network prefix is present in a given address', () => {
    const addressWithoutPrefix = '0xbAddaD0000000000000000000000000000000001'
    const prefix = getNetworkPrefix(addressWithoutPrefix)

    expect(prefix).toBe('')
  })

  // edge case if address starts with ':' char, ie ':0x123...'
  it('Returns an empty string if only two dots are present in the address', () => {
    const addressWithTwoDots = ':0xbAddaD0000000000000000000000000000000001'
    const prefix = getNetworkPrefix(addressWithTwoDots)

    expect(prefix).toBe('')
  })

  it('Returns empty prefix value if no address is present', () => {
    const emptyValue = ''
    const prefix = getNetworkPrefix(emptyValue)

    expect(prefix).toBe('')
  })

  it('Returns empty prefix value if no value is provided', () => {
    const prefix = getNetworkPrefix()

    expect(prefix).toBe('')
  })
})
