// @flow
import { List } from 'immutable'
import { buildSignaturesFrom } from '~/logic/safe/safeTxSigner'

describe('Signatures Blockchain Test', () => {
  it('generates signatures in natural order even checksumed', async () => {
    // GIVEN
    const userA = 'baR'
    const userB = 'baz'
    const userC = 'foZa'
    const sender = 'foZ'

    // WHEN
    const result = '0x' +
    // eslint-disable-next-line
    '000000000000000000000000' + 'baR' + '000000000000000000000000000000000000000000000000000000000000000001' +
    // eslint-disable-next-line
    '000000000000000000000000' + 'baz' + '000000000000000000000000000000000000000000000000000000000000000001' +
    // eslint-disable-next-line
    '000000000000000000000000' + 'foZ' + '000000000000000000000000000000000000000000000000000000000000000001' +
    // eslint-disable-next-line
    '000000000000000000000000' + 'foZa' + '000000000000000000000000000000000000000000000000000000000000000001'

    // THEN
    expect(buildSignaturesFrom(List([userA, userB, userC]), sender)).toEqual(result)
    expect(buildSignaturesFrom(List([userB, userA, userC]), sender)).toEqual(result)
    expect(buildSignaturesFrom(List([userA, sender, userC]), userB)).toEqual(result)
    expect(buildSignaturesFrom(List([sender, userA, userC]), userB)).toEqual(result)
    expect(buildSignaturesFrom(List([userB, sender, userC]), userA)).toEqual(result)
    expect(buildSignaturesFrom(List([sender, userB, userC]), userA)).toEqual(result)
    expect(buildSignaturesFrom(List([userA, userB, sender]), userC)).toEqual(result)
    expect(buildSignaturesFrom(List([userB, userA, sender]), userC)).toEqual(result)
    expect(buildSignaturesFrom(List([userA, sender, userB]), userC)).toEqual(result)
    expect(buildSignaturesFrom(List([sender, userA, userB]), userC)).toEqual(result)
    expect(buildSignaturesFrom(List([userB, sender, userA]), userC)).toEqual(result)
    expect(buildSignaturesFrom(List([sender, userB, userA]), userC)).toEqual(result)
  })
})
