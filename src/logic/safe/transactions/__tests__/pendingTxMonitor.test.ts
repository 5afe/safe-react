import * as store from 'src/store'
import * as web3 from 'src/logic/wallets/getWeb3'
import * as pendingMonitor from 'src/logic/safe/transactions/pendingTxMonitor'

const { _isPendingTxMined, monitorPendingTx, monitorAllPendingTxs: pendingTxsMonitor } = pendingMonitor

describe('_isPendingTxMined', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  it("doesn't throw if a transaction receipt exists", async () => {
    jest.spyOn(web3.getWeb3().eth, 'getTransaction').mockImplementation(() =>
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

    expect(async () => await _isPendingTxMined(0, 'fakeTxHash')).not.toThrow()
  })
  it("doesn't throw if the transaction was mined within 50 blocks", async () => {
    jest.spyOn(web3.getWeb3().eth, 'getTransaction').mockImplementation(() => Promise.resolve(null as any))
    jest.spyOn(web3.getWeb3().eth, 'getBlockNumber').mockImplementation(() => Promise.resolve(0))

    expect(async () => await _isPendingTxMined(0, 'fakeTxHash')).not.toThrow()
  })
  it("throws if there if no transaction receipt exists and it wasn't mined within 50 blocks", async () => {
    jest.spyOn(web3.getWeb3().eth, 'getTransaction').mockImplementation(() => Promise.resolve(null as any))
    jest.spyOn(web3.getWeb3().eth, 'getBlockNumber').mockImplementation(() => Promise.resolve(50))

    expect(async () => await _isPendingTxMined(0, 'fakeTxHash')).rejects.toThrow()
  })
})

describe('monitorPendingTx', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  it.skip('repeatedly checks for the tx', async () => {
    const isPendingSpy = jest.spyOn(pendingMonitor, '_isPendingTxMined').mockImplementation(() => Promise.reject())

    await monitorPendingTx(0, 'fakeTxId', 'fakeTxHash', {
      numOfAttempts: 5,
      startingDelay: 0,
      timeMultiple: 0,
      maxDelay: 0,
    })

    expect(isPendingSpy).toHaveBeenCalledTimes(5)
  })

  it('clears the pending transaction if it was mined', async () => {
    jest.spyOn(pendingMonitor, '_isPendingTxMined').mockImplementation(() => Promise.resolve())

    const dispatchSpy = jest.spyOn(store.store, 'dispatch').mockImplementation(() => jest.fn())

    await monitorPendingTx(0, 'fakeTxId', 'fakeTxHash', { numOfAttempts: 1, startingDelay: 0, timeMultiple: 0 })

    expect(dispatchSpy).toHaveBeenCalledTimes(2)
  })

  it('clears the pending transaction it the tx was not mined within 50 blocks', async () => {
    jest.spyOn(pendingMonitor, '_isPendingTxMined').mockImplementation(() => Promise.reject())

    const dispatchSpy = jest.spyOn(store.store, 'dispatch').mockImplementation(() => jest.fn())

    await monitorPendingTx(0, 'fakeTxId', 'fakeTxHash', { numOfAttempts: 1, startingDelay: 0, timeMultiple: 0 })

    expect(dispatchSpy).toHaveBeenCalledTimes(2)
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

    const getWeb3Spy = jest.spyOn(web3, 'getWeb3')

    await pendingTxsMonitor()

    expect(getWeb3Spy).not.toHaveBeenCalled()
  })
  it('breaks if no block number returns', async () => {
    jest.spyOn(store.store, 'getState').mockImplementation(() => ({
      pendingTransactions: {
        '4': { fakeTxId: 'fakeTxHash' },
      },
      config: {
        chainId: '4',
      },
    }))

    jest.spyOn(web3.getWeb3().eth, 'getBlockNumber').mockImplementation(() => Promise.reject())

    const isPendingSpy = jest.spyOn(pendingMonitor, '_isPendingTxMined').mockImplementation(jest.fn())

    try {
      await pendingTxsMonitor()

      // Fail test if above expression doesn't throw anything
      expect(true).toBe(false)
    } catch (e) {
      expect(isPendingSpy).not.toHaveBeenCalled()
    }
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

    jest.spyOn(web3.getWeb3().eth, 'getBlockNumber').mockImplementation(() => Promise.resolve(0))

    const monitorPendingSpy = jest.spyOn(pendingMonitor, 'monitorPendingTx').mockImplementation(() => Promise.resolve())

    await pendingTxsMonitor()

    expect(monitorPendingSpy.mock.calls).toEqual([
      [0, 'fakeTxId', 'fakeTxHash'],
      [0, 'fakeTxId2', 'fakeTxHash2'],
      [0, 'fakeTxId2', 'fakeTxHash2'],
    ])
  })
})
