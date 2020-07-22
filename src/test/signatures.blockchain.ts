// 
import { List } from 'immutable'
import { generateSignaturesFromTxConfirmations } from 'src/logic/safe/safeTxSigner'

const makeMockConfirmation = (address) => ({ owner: { address } })

describe('Signatures Blockchain Test', () => {
  it('generates signatures in natural order even checksumed', async () => {
    // GIVEN
    const userA = 'baR'
    const userB = 'baz'
    const userC = 'foZa'
    const userD = 'foZ'

    const confirmationA = makeMockConfirmation(userA)
    const confirmationB = makeMockConfirmation(userB)
    const confirmationC = makeMockConfirmation(userC)
    const confirmationD = makeMockConfirmation(userD)

    // WHEN
    const result = '0x'
      // eslint-disable-next-line
      + "000000000000000000000000" +
      'bar'
      + '000000000000000000000000000000000000000000000000000000000000000001'
      // eslint-disable-next-line
      + "000000000000000000000000" +
      'baz'
      + '000000000000000000000000000000000000000000000000000000000000000001'
      // eslint-disable-next-line
      + "000000000000000000000000" +
      'foz'
      + '000000000000000000000000000000000000000000000000000000000000000001'
      // eslint-disable-next-line
      + "000000000000000000000000" +
      'foza'
      + '000000000000000000000000000000000000000000000000000000000000000001'

    // THEN
    expect(
      generateSignaturesFromTxConfirmations(
        List([confirmationA, confirmationB, confirmationC]),
        userD,
      ),
    ).toEqual(result)
    expect(
      generateSignaturesFromTxConfirmations(
        List([confirmationB, confirmationA, confirmationC]),
        userD,
      ),
    ).toEqual(result)
    expect(
      generateSignaturesFromTxConfirmations(
        List([confirmationA, confirmationD, confirmationC]),
        userB,
      ),
    ).toEqual(result)
    expect(
      generateSignaturesFromTxConfirmations(
        List([confirmationD, confirmationA, confirmationC]),
        userB,
      ),
    ).toEqual(result)
    expect(
      generateSignaturesFromTxConfirmations(
        List([confirmationB, confirmationD, confirmationC]),
        userA,
      ),
    ).toEqual(result)
    expect(
      generateSignaturesFromTxConfirmations(
        List([confirmationD, confirmationB, confirmationC]),
        userA,
      ),
    ).toEqual(result)
    expect(
      generateSignaturesFromTxConfirmations(
        List([confirmationA, confirmationB, confirmationD]),
        userC,
      ),
    ).toEqual(result)
    expect(
      generateSignaturesFromTxConfirmations(
        List([confirmationB, confirmationA, confirmationD]),
        userC,
      ),
    ).toEqual(result)
    expect(
      generateSignaturesFromTxConfirmations(
        List([confirmationA, confirmationD, confirmationB]),
        userC,
      ),
    ).toEqual(result)
    expect(
      generateSignaturesFromTxConfirmations(
        List([confirmationD, confirmationA, confirmationB]),
        userC,
      ),
    ).toEqual(result)
    expect(
      generateSignaturesFromTxConfirmations(
        List([confirmationB, confirmationD, confirmationA]),
        userC,
      ),
    ).toEqual(result)
    expect(
      generateSignaturesFromTxConfirmations(
        List([confirmationD, confirmationB, confirmationA]),
        userC,
      ),
    ).toEqual(result)
  })
})
