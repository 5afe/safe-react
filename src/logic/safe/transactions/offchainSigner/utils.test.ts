import { isTxHashSignedWithPrefix, adjustV } from './utils'

describe('isTxHashSignedWithPrefix', () => {
  it('returns false if message was signed without a prefix', () => {
    const safeTxHash = '0x4de27e660bd23052b71c854b0188ef1c5b325b10075c70f27afe2343e5c287f5'
    const owner = '0xbc2BB26a6d821e69A38016f3858561a1D80d4182'
    const signature =
      '0x12f8d73b47a0a664294caac0bd6ccf03a0d1d3d1943bdd138a9757f993cb4f7c432f029873af8ad898d3f83a8a42f765628f36d39a01c90708ce5bd6d77a269d1b'

    expect(isTxHashSignedWithPrefix(safeTxHash, signature, owner)).toEqual(false)
  })

  it('returns true if message was signed with a prefix', () => {
    const safeTxHash = '0x4de27e660bd23052b71c854b0188ef1c5b325b10075c70f27afe2343e5c287f5'
    const owner = '0xa088642a83BF49189d5160e2632392949Bb4296D'
    const signature =
      '0x4d44abdcc39e259238870493c29d26fbe14b0564afe2b25326311ddc397cff8d4014e09a2a296efb2dc0231c622289e015d0cbd469ae67d509675e6112bd0b061b'

    expect(isTxHashSignedWithPrefix(safeTxHash, signature, owner)).toEqual(true)
  })
})

describe('adjustV', () => {
  it('eth_sign: adjusts V to V > 30 when message is signed with a prefix', () => {
    const safeTxHash = '0x4de27e660bd23052b71c854b0188ef1c5b325b10075c70f27afe2343e5c287f5'
    const owner = '0xa088642a83BF49189d5160e2632392949Bb4296D'
    const signature =
      '0x4d44abdcc39e259238870493c29d26fbe14b0564afe2b25326311ddc397cff8d4014e09a2a296efb2dc0231c622289e015d0cbd469ae67d509675e6112bd0b061b'
    const adjustedSignature =
      '0x4d44abdcc39e259238870493c29d26fbe14b0564afe2b25326311ddc397cff8d4014e09a2a296efb2dc0231c622289e015d0cbd469ae67d509675e6112bd0b061f'

    expect(adjustV('eth_sign', signature, safeTxHash, owner)).toEqual(adjustedSignature)
  })

  it('eth_sign: adjusts V to V > 30 when message is signed with a prefix and V < 27', () => {
    const safeTxHash = '0x4de27e660bd23052b71c854b0188ef1c5b325b10075c70f27afe2343e5c287f5'
    const owner = '0xa088642a83BF49189d5160e2632392949Bb4296D'
    const signature =
      '0x4d44abdcc39e259238870493c29d26fbe14b0564afe2b25326311ddc397cff8d4014e09a2a296efb2dc0231c622289e015d0cbd469ae67d509675e6112bd0b0601'
    const adjustedSignature =
      '0x4d44abdcc39e259238870493c29d26fbe14b0564afe2b25326311ddc397cff8d4014e09a2a296efb2dc0231c622289e015d0cbd469ae67d509675e6112bd0b0620'

    expect(adjustV('eth_sign', signature, safeTxHash, owner)).toEqual(adjustedSignature)
  })

  it("eth_sign: doesn't touch V when message is signed without a prefix and V is one of {27, 28}", () => {
    const safeTxHash = '0x4de27e660bd23052b71c854b0188ef1c5b325b10075c70f27afe2343e5c287f5'
    const owner = '0xbc2BB26a6d821e69A38016f3858561a1D80d4182'
    const signature =
      '0x12f8d73b47a0a664294caac0bd6ccf03a0d1d3d1943bdd138a9757f993cb4f7c432f029873af8ad898d3f83a8a42f765628f36d39a01c90708ce5bd6d77a269d1b'

    expect(adjustV('eth_sign', signature, safeTxHash, owner)).toEqual(signature)
  })

  it('eth_sign: When V is < 27, it adds 27 ', () => {
    const safeTxHash = '0x4de27e660bd23052b71c854b0188ef1c5b325b10075c70f27afe2343e5c287f5'
    const owner = '0xbc2BB26a6d821e69A38016f3858561a1D80d4182'
    const signature =
      '0x12f8d73b47a0a664294caac0bd6ccf03a0d1d3d1943bdd138a9757f993cb4f7c432f029873af8ad898d3f83a8a42f765628f36d39a01c90708ce5bd6d77a269d1b'

    expect(adjustV('eth_sign', signature, safeTxHash, owner)).toEqual(signature)
  })

  it('eth_signTypedData: When V is one of {0, 1}, it adds 27 ', () => {
    const signature =
      '0x2b1b16217bafb209840057ffa51b4d850656abb354d1db1e45d3b644eaa9825575249e00c2bc844826e09f6afbfbc28018726ef34fb7d4052ca70e1b51ffb06801'
    const adjustedSignature =
      '0x2b1b16217bafb209840057ffa51b4d850656abb354d1db1e45d3b644eaa9825575249e00c2bc844826e09f6afbfbc28018726ef34fb7d4052ca70e1b51ffb0681c'

    expect(adjustV('eth_signTypedData', signature)).toEqual(adjustedSignature)
  })

  it("eth_signTypedData: When V is one of {27, 28}, it doesn't do anything", () => {
    const signature =
      '0x2b1b16217bafb209840057ffa51b4d850656abb354d1db1e45d3b644eaa9825575249e00c2bc844826e09f6afbfbc28018726ef34fb7d4052ca70e1b51ffb0681c'

    expect(adjustV('eth_signTypedData', signature)).toEqual(signature)
  })
})
