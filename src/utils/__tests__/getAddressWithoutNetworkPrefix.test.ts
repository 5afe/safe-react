import getAddressWithoutNetworkPrefix from '../getAddressWithoutNetworkPrefix'

describe('getAddressWithoutNetworkPrefix', () => {
  it('Returns address from a given prefixed address', () => {
    const prefixedAddress = 'rin:0xbAddaD0000000000000000000000000000000001'
    const address = getAddressWithoutNetworkPrefix(prefixedAddress)

    expect(address).toBe('0xbAddaD0000000000000000000000000000000001')
  })

  it('Returns empty address value if no prefixed address is present', () => {
    const addressWithoutPrefix = '0xbAddaD0000000000000000000000000000000001'
    const address = getAddressWithoutNetworkPrefix(addressWithoutPrefix)

    expect(address).toBe('0xbAddaD0000000000000000000000000000000001')
  })

  it('Returns empty address value if no address is present', () => {
    const emptyValue = ''
    const address = getAddressWithoutNetworkPrefix(emptyValue)

    expect(address).toBe('')
  })

  it('Returns empty address value if no value is provided', () => {
    const address = getAddressWithoutNetworkPrefix()

    expect(address).toBe('')
  })
})
