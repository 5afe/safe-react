import * as store from 'src/store'
import * as web3 from 'src/logic/wallets/getWeb3'
import * as pendingMonitor from 'src/logic/safe/transactions/pendingTxMonitor'

const { isPendingTxMined, pendingTxsMonitor } = pendingMonitor

describe('isPendingTxMined', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  it('removes the pending tx with the tx receipt', async () => {
    jest.spyOn(web3.getWeb3ReadOnly().eth, 'getTransaction').mockImplementation(() =>
      Promise.resolve({
        hash: '',
        nonce: 0,
        blockHash: '',
        blockNumber: 0,
        transactionIndex: 0,
        from: '',
        to: '',
        value: '',
        gasPrice: '',
        gas: 0,
        input: '',
      }),
    )

    const dispatchSpy = jest.spyOn(store.store, 'dispatch').mockImplementation(jest.fn)

    await isPendingTxMined(0, '', '')

    expect(dispatchSpy).toHaveBeenCalledTimes(2)
  })
  it('removes the pending tx if the transaction is not mined within 50 blocks', async () => {
    jest.spyOn(web3.getWeb3ReadOnly().eth, 'getTransaction').mockImplementation(() => Promise.resolve(null as any))
    jest.spyOn(web3.getWeb3ReadOnly().eth, 'getBlockNumber').mockImplementation(() => Promise.resolve(123))

    const dispatchSpy = jest.spyOn(store.store, 'dispatch').mockImplementation(() => jest.fn())

    await isPendingTxMined(0, '', '')

    expect(dispatchSpy).toHaveBeenCalledTimes(2)
  })
  it('throws if there is no tx receipt or is is not mined within 50 blocks', async () => {
    jest.spyOn(web3.getWeb3ReadOnly().eth, 'getTransaction').mockImplementation(() => Promise.resolve(null as any))
    jest.spyOn(web3.getWeb3ReadOnly().eth, 'getBlockNumber').mockImplementation(() => Promise.resolve(0))

    expect(async () => await isPendingTxMined(0, '', '')).rejects.toThrow()
  })
})

describe('pendingTxsMonitor', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  it('breaks if there are no pending txs', async () => {
    jest.spyOn(store.store, 'getState').mockImplementation(() => ({
      pendingTransactions: {},
      config: {
        chainId: '4',
      },
    }))

    const getWeb3Spy = jest.spyOn(web3, 'getWeb3ReadOnly')

    await pendingTxsMonitor()

    expect(getWeb3Spy).not.toHaveBeenCalled()
  })
  it('breaks if no block number is retrieved', async () => {
    jest.spyOn(store.store, 'getState').mockImplementation(() => ({
      pendingTransactions: {
        '4': { fakeTxId: 'fakeTxHash' },
      },
      config: {
        chainId: '4',
      },
    }))

    jest.spyOn(web3.getWeb3ReadOnly().eth, 'getBlockNumber').mockImplementation(() => Promise.reject())

    const isPendingSpy = jest.spyOn(pendingMonitor, 'isPendingTxMined').mockImplementation(jest.fn())

    try {
      await pendingTxsMonitor()

      // Fail test if above expression doesn't throw anything
      expect(true).toBe(false)
    } catch (e) {
      expect(isPendingSpy).not.toHaveBeenCalled()
    }
  })
  it.skip('repeatedly checks for the tx', async () => {
    jest.spyOn(store.store, 'getState').mockImplementation(() => ({
      pendingTransactions: {
        '4': {
          fakeTxId: 'fakeTxHash',
        },
      },
      config: {
        chainId: '4',
      },
    }))

    jest.spyOn(web3.getWeb3ReadOnly().eth, 'getBlockNumber').mockImplementation(() => Promise.resolve(0))

    const isPendingSpy = jest.spyOn(pendingMonitor, 'isPendingTxMined').mockImplementation(() => Promise.reject())

    jest.useFakeTimers('modern')
    pendingTxsMonitor()
    jest.runAllTimers()
    await Promise.resolve()

    expect(isPendingSpy).toBeCalledTimes(6)
  })
  it.skip('checks each pending tx', async () => {
    jest.spyOn(store.store, 'getState').mockImplementation(() => ({
      pendingTransactions: {
        '4': {
          fakeTxId: 'fakeTxHash',
          fakeTxId2: 'fakeTxHash2',
          fakeTxId3: 'fakeTxHash3',
        },
      },
      config: {
        chainId: '4',
      },
    }))

    jest.spyOn(web3.getWeb3ReadOnly().eth, 'getBlockNumber').mockImplementation(() => Promise.resolve(0))

    const isPendingSpy = jest
      .spyOn(pendingMonitor, 'isPendingTxMined')
      .mockImplementation(jest.fn(() => Promise.resolve()))

    jest.useFakeTimers('modern')
    pendingTxsMonitor()
    jest.runAllTimers()
    await Promise.resolve()

    expect(isPendingSpy.mock.calls).toEqual([
      [0, 'fakeTxId', 'fakeTxHash'],
      [0, 'fakeTxId2', 'fakeTxHash2'],
      [0, 'fakeTxId2', 'fakeTxHash2'],
    ])
  })
})
