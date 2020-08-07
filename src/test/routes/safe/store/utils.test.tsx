import { shouldExecuteTransaction } from 'src/routes/safe/store/actions/utils'
import { getMockedSafeInstance, getMockedTxServiceModel } from 'src/test/utils/safeHelper'

describe('shouldExecuteTransaction', () => {
  it('Given a safe with a threshold > 1 should return false',  async () => {
    // given
    const nonce = '0'
    const threshold = '2'
    const safeInstance = getMockedSafeInstance({ threshold })
    const lastTx = getMockedTxServiceModel({})

    // when
    const result = await shouldExecuteTransaction(safeInstance, nonce, lastTx)

    // then
    expect(result).toBe(false)
  })
  it('Given a safe with a threshold === 1 and the last transaction is the creation transaction (nonce 0), should return true ',  async () => {
    // given
    const nonce = '0'
    const threshold = '1'
    const safeInstance = getMockedSafeInstance({ threshold })
    const lastTx = getMockedTxServiceModel({})

    // when
    const result = await shouldExecuteTransaction(safeInstance, nonce, lastTx)

    // then
    expect(result).toBe(true)
  })
  it('Given a safe with a threshold === 1 and the last transaction is not the creation, the last transaction is already executed, return true ',  async () => {
    // given
    const nonce = '10'
    const threshold = '1'
    const safeInstance = getMockedSafeInstance({ threshold })
    const lastTx = getMockedTxServiceModel({ isExecuted: true })

    // when
    const result = await shouldExecuteTransaction(safeInstance, nonce, lastTx)

    // then
    expect(result).toBe(true)
  })
  it('Given a safe with a threshold === 1 and the last transaction is not the creation, the last transaction is not already executed, return false ',  async () => {
    // given
    const nonce = '10'
    const threshold = '1'
    const safeInstance = getMockedSafeInstance({ threshold })
    const lastTx = getMockedTxServiceModel({ isExecuted: false })

    // when
    const result = await shouldExecuteTransaction(safeInstance, nonce, lastTx)

    // then
    expect(result).toBe(false)
  })
})