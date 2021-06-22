import { isTxHashSignedWithPrefix } from './utils'

describe('isTxHashSignedWithPrefix', () => {
  it('returns false if message was signed without a prefix', () => {
    const safeTxHash = '0x4de27e660bd23052b71c854b0188ef1c5b325b10075c70f27afe2343e5c287f5'
    const owner = '0xbc2BB26a6d821e69A38016f3858561a1D80d4182'
    const signature =
      '0x12f8d73b47a0a664294caac0bd6ccf03a0d1d3d1943bdd138a9757f993cb4f7c432f029873af8ad898d3f83a8a42f765628f36d39a01c90708ce5bd6d77a269d1b'

    expect(isTxHashSignedWithPrefix(safeTxHash, signature, owner)).toEqual(false)
  })
})
