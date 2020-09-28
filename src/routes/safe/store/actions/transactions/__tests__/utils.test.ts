import { getLastTx, getNewTxNonce, shouldExecuteTransaction } from 'src/logic/safe/store/actions/utils'
import { getMockedSafeInstance, getMockedTxServiceModel } from 'src/test/utils/safeHelper'
import axios from 'axios'
import { buildTxServiceUrl } from 'src/logic/safe/transactions'

describe('shouldExecuteTransaction', () => {
  it('It should return false if given a safe with a threshold > 1', async () => {
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
  it('It should return true if given a safe with a threshold === 1 and the previous transaction is already executed', async () => {
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
  it('It should return true if given a safe with a threshold === 1 and the previous transaction is already executed', async () => {
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
  it('It should return false if given a safe with a threshold === 1 and the previous transaction is not yet executed', async () => {
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

describe('getNewTxNonce', () => {
  it('It should return 2 if given the last transaction with nonce 1', async () => {
    // given
    const safeInstance = getMockedSafeInstance({})
    const lastTx = getMockedTxServiceModel({ nonce: 1 })
    const expectedResult = '2'

    // when
    const result = await getNewTxNonce(undefined, lastTx, safeInstance)

    // then
    expect(result).toBe(expectedResult)
  })
  it('It should return 0 if given a safe with nonce 0 and no transactions should use safe contract instance for retrieving nonce', async () => {
    // given
    const safeNonce = '0'
    const safeInstance = getMockedSafeInstance({ nonce: safeNonce })
    const expectedResult = '0'
    const mockFnCall = jest.fn().mockImplementation(() => safeNonce)
    const mockFnNonce = jest.fn().mockImplementation(() => ({ call: mockFnCall }))

    safeInstance.methods.nonce = mockFnNonce

    // when
    const result = await getNewTxNonce(undefined, null, safeInstance)

    // then
    expect(result).toBe(expectedResult)
    expect(mockFnNonce).toHaveBeenCalled()
    expect(mockFnCall).toHaveBeenCalled()
    mockFnNonce.mockRestore()
    mockFnCall.mockRestore()
  })
  it('Given a Safe and the last transaction, should return nonce of the last transaction + 1', async () => {
    // given
    const safeInstance = getMockedSafeInstance({})
    const expectedResult = '11'
    const lastTx = getMockedTxServiceModel({ nonce: 10 })

    // when
    const result = await getNewTxNonce(undefined, lastTx, safeInstance)

    // then
    expect(result).toBe(expectedResult)
  })
  it('Given a pre-calculated nonce number should return it', async () => {
    // given
    const safeInstance = getMockedSafeInstance({})
    const expectedResult = '114'
    const nextNonce = '114'

    // when
    const result = await getNewTxNonce(nextNonce, null, safeInstance)

    // then
    expect(result).toBe(expectedResult)
  })
})

jest.mock('axios')
jest.mock('console')
describe('getLastTx', () => {
  afterAll(() => {
    jest.unmock('axios')
    jest.unmock('console')
  })
  const safeAddress = '0xdfA693da0D16F5E7E78FdCBeDe8FC6eBEa44f1Cf'
  it('It should return the last transaction for a given a safe address', async () => {
    // given
    const lastTx = getMockedTxServiceModel({ nonce: 1 })
    const url = buildTxServiceUrl(safeAddress)

    // when
    // @ts-ignore
    axios.get.mockImplementationOnce(() => {
      return {
        data: {
          results: [lastTx],
        },
      }
    })

    const result = await getLastTx(safeAddress)

    // then
    expect(result).toStrictEqual(lastTx)
    expect(axios.get).toHaveBeenCalled()
    expect(axios.get).toBeCalledWith(url, { params: { limit: 1 } })
  })
  it('If should return null If catches an error getting last transaction', async () => {
    // given
    const lastTx = null
    const url = buildTxServiceUrl(safeAddress)

    // when
    // @ts-ignore
    axios.get.mockImplementationOnce(() => {
      throw new Error()
    })
    console.error = jest.fn()
    const result = await getLastTx(safeAddress)
    const spyConsole = jest.spyOn(console, 'error').mockImplementation()

    // then
    expect(result).toStrictEqual(lastTx)
    expect(axios.get).toHaveBeenCalled()
    expect(axios.get).toBeCalledWith(url, { params: { limit: 1 } })
    expect(spyConsole).toHaveBeenCalled()
  })
})
