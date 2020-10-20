import { sameAddress } from '../ethAddresses'

describe('ethAddresses utils', () => {
  const ac0 = '0x0000000000000000000000000000000000000000'
  const ac1Upper = '0x00000000000000000000000000000000000000A1'
  const ac1Lower = '0x00000000000000000000000000000000000000a1'
  const ac2 = '0x00000000000000000000000000000000000000A2'

  describe('sameAddress', () => {
    it('Returns false if first argument is undefined', () => {
      const res = sameAddress(undefined, ac0)
      expect(res).toBeFalsy()
    })

    it('Returns false if the second argument is undefined', () => {
      const res = sameAddress(ac0, undefined)
      expect(res).toBeFalsy()
    })

    it('Returns false if the arguments have different literals', () => {
      const res = sameAddress(ac1Upper, ac2)
      expect(res).toBeFalsy()
    })

    it('Returns false if the arguments have the same literals', () => {
      const res = sameAddress(ac1Upper, ac1Lower)
      expect(res).toBeTruthy()
    })
  })
})
