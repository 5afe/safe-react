import { checksumAddress, isChecksumAddress } from '../checksumAddress'

describe('checksumAddress', () => {
  it('Returns a checksummed address', () => {
    const address = '0xbaddad0000000000000000000000000000000001'
    const checksummedAddress = checksumAddress(address)

    expect(checksummedAddress).toBe('0xbAddaD0000000000000000000000000000000001')
    expect(isChecksumAddress(checksummedAddress)).toBeTruthy()
  })
  it('Throws if an invalid address was provided', () => {
    const address = '0xbaddad'

    try {
      checksumAddress(address)
    } catch (e) {
      expect(e.message).toBe('Given address "0xbaddad" is not a valid Ethereum address.')
    }
  })
})
