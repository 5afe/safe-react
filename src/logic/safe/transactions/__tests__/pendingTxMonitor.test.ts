import * as store from 'src/store'
import * as web3 from 'src/logic/wallets/getWeb3'
import { PendingTxMonitor } from 'src/logic/safe/transactions/pendingTxMonitor'

const originalIsTxMined = PendingTxMonitor._isTxMined

describe('PendingTxMonitor', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  afterEach(() => {
    PendingTxMonitor._isTxMined = originalIsTxMined
  })
  describe('_isTxMined', () => {
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

      expect(async () => await PendingTxMonitor._isTxMined(0, 'fakeTxHash')).not.toThrow()
    })
    it("doesn't throw if the transaction was mined within 50 blocks", async () => {
      jest.spyOn(web3.getWeb3().eth, 'getTransaction').mockImplementation(() => Promise.resolve(null as any))
      jest.spyOn(web3.getWeb3().eth, 'getBlockNumber').mockImplementation(() => Promise.resolve(51))

      expect(async () => await PendingTxMonitor._isTxMined(0, 'fakeTxHash')).not.toThrow()
    })
    it("throws if there if no transaction receipt exists and it wasn't mined within 50 blocks", async () => {
      jest.spyOn(web3.getWeb3().eth, 'getTransaction').mockImplementation(() => Promise.resolve(null as any))
      jest.spyOn(web3.getWeb3().eth, 'getBlockNumber').mockImplementation(() => Promise.resolve(50))

      try {
        await PendingTxMonitor._isTxMined(0, 'fakeTxHash')

        // Fail test if above expression doesn't throw anything
        expect(true).toBe(false)
      } catch (e) {
        expect(e.message).toEqual('Pending transaction not found')
      }
    })
  })

  describe('monitorTx', () => {
    it('clears the pending transaction if it was mined', async () => {
      PendingTxMonitor._isTxMined = jest.fn(() => Promise.resolve())

      const dispatchSpy = jest.spyOn(store.store, 'dispatch').mockImplementation(() => jest.fn())

      await PendingTxMonitor.monitorTx(0, 'fakeTxId', 'fakeTxHash', {
        numOfAttempts: 1,
        startingDelay: 0,
        timeMultiple: 0,
      })

      expect(dispatchSpy).toHaveBeenCalledTimes(2)
    })

    it('clears the pending transaction it the tx was not mined within 50 blocks', async () => {
      PendingTxMonitor._isTxMined = jest.fn(() => Promise.reject())

      const dispatchSpy = jest.spyOn(store.store, 'dispatch').mockImplementation(() => jest.fn())

      await PendingTxMonitor.monitorTx(0, 'fakeTxId', 'fakeTxHash', {
        numOfAttempts: 1,
        startingDelay: 0,
        timeMultiple: 0,
      })

      expect(dispatchSpy).toHaveBeenCalledTimes(2)
    })
  })

  describe('monitorAllPendingTxs', () => {
    it('breaks if there are no pending txs', async () => {
      jest.spyOn(store.store, 'getState').mockImplementation(() => ({
        pendingTransactions: {},
        config: {
          chainId: '4',
        },
      }))

      const getWeb3Spy = jest.spyOn(web3, 'getWeb3')

      await PendingTxMonitor.monitorAllTxs()

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

      const isPendingSpy = jest.spyOn(PendingTxMonitor, '_isTxMined').mockImplementation(jest.fn())

      try {
        await PendingTxMonitor.monitorAllTxs()

        // Fail test if above expression doesn't throw anything
        expect(true).toBe(false)
      } catch (e) {
        expect(isPendingSpy).not.toHaveBeenCalled()
      }
    })

    it('checks each pending tx', async () => {
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

      PendingTxMonitor._isTxMined = jest.fn(() => Promise.resolve())

      await PendingTxMonitor.monitorAllTxs()

      expect((PendingTxMonitor._isTxMined as jest.Mock).mock.calls).toEqual([
        [0, 'fakeTxHash'],
        [0, 'fakeTxHash2'],
        [0, 'fakeTxHash3'],
      ])
    })
  })
})
