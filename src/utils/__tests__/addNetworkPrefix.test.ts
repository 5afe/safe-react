import addNetworkPrefix from '../addNetworkPrefix'

describe('addNetworkPrefix', () => {
  it('Returns prefixed address', () => {
    const address = '0xbAddaD0000000000000000000000000000000001'
    const prefixedAddress = addNetworkPrefix(address)

    expect(prefixedAddress).toBe('rin:0xbAddaD0000000000000000000000000000000001')
  })

  it('Returns empty string if no address is provided', () => {
    const emptyValue = addNetworkPrefix()

    expect(emptyValue).toBe('')
  })

  it('Returns address without prefix if showNetworkPrefix is disabled', () => {
    const address = '0xbAddaD0000000000000000000000000000000001'
    const showNetworkPrefix = false
    const prefixedAddress = addNetworkPrefix(address, showNetworkPrefix)

    expect(prefixedAddress).toBe('0xbAddaD0000000000000000000000000000000001')
  })

  it('Returns address with a custom prefix if is is present', () => {
    const address = '0xbAddaD0000000000000000000000000000000001'
    const showNetworkPrefix = true
    const customNetworkPrefix = 'vt'
    const prefixedAddress = addNetworkPrefix(address, showNetworkPrefix, customNetworkPrefix)

    expect(prefixedAddress).toBe('vt:0xbAddaD0000000000000000000000000000000001')
  })

  it('Keeps the current network prefix provided if its present in the address', () => {
    const prefixedAddress = 'vt:0xbAddaD0000000000000000000000000000000001'
    const returnedAddress = addNetworkPrefix(prefixedAddress)

    expect(returnedAddress).toBe('vt:0xbAddaD0000000000000000000000000000000001')
  })
})
