import { TxSender } from 'src/logic/safe/store/actions/createTransaction'
import { EMPTY_DATA } from 'src/logic/wallets/ethTransactions'
import { store } from 'src/store'
import { ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'
import * as utils from 'src/logic/safe/store/actions/utils'
import * as walletSelectors from 'src/logic/wallets/store/selectors'
import * as safeSelectors from 'src/logic/safe/store/selectors'
import * as safeContracts from 'src/logic/contracts/safeContracts'
import * as notificationBuilder from 'src/logic/notifications/notificationBuilder'
import * as safeTxSigner from 'src/logic/safe/safeTxSigner'
import * as offChainSigner from 'src/logic/safe/transactions/offchainSigner'
import * as txHistory from 'src/logic/safe/transactions/txHistory'
import * as pendingTransactions from 'src/logic/safe/store/actions/pendingTransactions'
import * as fetchTransactions from 'src/logic/safe/store/actions/transactions/fetchTransactions'
import * as aboutToExecuteTx from 'src/logic/safe/utils/aboutToExecuteTx'
import * as send from 'src/logic/safe/transactions/send'
import * as getWeb3 from 'src/logic/wallets/getWeb3'
import { waitFor } from '@testing-library/react'
import { LocalTransactionStatus } from 'src/logic/safe/store/models/types/gateway.d'

jest.mock('bnc-onboard', () => () => ({
  config: jest.fn(),
  getState: jest.fn(() => ({
    appNetworkId: 4,
    wallet: {
      provider: {
        name: 'MetaMask',
        account: '0x123',
        network: '4',
        available: true,
        loaded: true,
        ensDomain: '',
      },
    },
  })),
  walletCheck: jest.fn(),
  walletReset: jest.fn(),
  walletSelect: jest.fn(), // returns true or false
}))

jest.mock('src/logic/safe/store/actions/transactions/fetchTransactions', () => {
  const original = jest.requireActual('src/logic/safe/store/actions/transactions/fetchTransactions')
  return {
    __esModule: true,
    ...original,
    default: jest.fn(),
  }
})

jest.mock('react-redux', () => {
  const original = jest.requireActual('react-redux')
  return {
    ...original,
    useSelector: jest.fn,
  }
})

const mockTransactionDetails = {
  txId: '',
  executedAt: null,
  txStatus: LocalTransactionStatus['SUCCESS'],
  txInfo: {
    type: 'Transfer',
    sender: {
      value: '',
      name: null,
      logoUri: null,
    },
    recipient: {
      value: '',
      name: null,
      logoUri: null,
    },
    direction: 'OUTGOING',
    transferInfo: {
      type: 'ERC20',
      tokenAddress: '',
      tokenName: null,
      tokenSymbol: null,
      logoUri: null,
      decimals: null,
      value: '',
    },
  },
  txData: null,
  detailedExecutionInfo: null,
  txHash: null,
  safeAppInfo: null,
}

const mockTxProps = {
  from: '',
  to: '',
  valueInWei: '',
  notifiedTransaction: '',
  safeAddress: '',
  txData: EMPTY_DATA,
  operation: 0,
  navigateToTransactionsTab: false,
  origin: null,
  safeTxGas: '',
  txNonce: '0',
}

const mockPromiEvent = {
  once: jest.fn((_, handler) => handler('mocktxhash')) as any,
  on: jest.fn(),
  then: jest.fn(),
  catch: jest.fn(),
  finally: jest.fn(),
  [Symbol.toStringTag]: '',
}

describe('TxSender', () => {
  let tryOffChainSigningSpy, saveTxToHistorySpy, addPendingTransactionSpy, navigateToTxSpy, fetchTransactionsSpy

  beforeEach(() => {
    jest.restoreAllMocks()
    jest.spyOn(utils, 'getNonce')
    jest.spyOn(safeSelectors, 'currentSafeCurrentVersion')
    jest.spyOn(walletSelectors, 'providerSelector').mockImplementation(() => ({
      name: 'MetaMask',
      account: '0x123',
      network: '4',
      available: true,
      loaded: true,
      ensDomain: '',
    }))
    jest.spyOn(safeContracts, 'getGnosisSafeInstanceAt')
    jest.spyOn(notificationBuilder, 'createTxNotifications')
    jest.spyOn(getWeb3, 'isSmartContractWallet')
    tryOffChainSigningSpy = jest
      .spyOn(offChainSigner, 'tryOffChainSigning')
      .mockImplementation(() => Promise.resolve('mocksignature'))
    saveTxToHistorySpy = jest
      .spyOn(txHistory, 'saveTxToHistory')
      .mockImplementation(() => Promise.resolve(mockTransactionDetails as any))
    addPendingTransactionSpy = jest.spyOn(pendingTransactions, 'addPendingTransaction')
    navigateToTxSpy = jest.spyOn(utils, 'navigateToTx')
    fetchTransactionsSpy = jest.spyOn(fetchTransactions, 'default')

    // Mock the onboard check
    TxSender._isOnboardReady = jest.fn(() => Promise.resolve(true))
  })

  it('handles approving a transaction', async () => {
    jest.spyOn(safeTxSigner, 'checkIfOffChainSignatureIsPossible').mockImplementation(() => true)
    const sender = new TxSender()

    await sender.prepare(jest.fn(), store.getState(), mockTxProps)

    sender.isFinalization = false
    sender.txId = '1'
    sender.safeTxHash = ''
    sender.txArgs = {
      safeInstance: sender.safeInstance,
      to: mockTxProps.to,
      valueInWei: mockTxProps.valueInWei,
      data: mockTxProps.txData,
      operation: mockTxProps.operation,
      nonce: Number.parseInt(sender.nonce),
      safeTxGas: mockTxProps.safeTxGas,
      baseGas: '0',
      gasPrice: '0',
      gasToken: ZERO_ADDRESS,
      refundReceiver: ZERO_ADDRESS,
      sender: mockTxProps.from,
      sigs: '',
    }

    sender.submitTx()

    await waitFor(() => {
      expect(tryOffChainSigningSpy).toHaveBeenCalledTimes(1)
      expect(saveTxToHistorySpy).toHaveBeenCalledTimes(1)
      expect(addPendingTransactionSpy).toHaveBeenCalledTimes(0)
      expect(navigateToTxSpy).toHaveBeenCalledTimes(0)
      expect(fetchTransactionsSpy).toHaveBeenCalledTimes(1)
    })
  })

  xit('handles creating a transaction', async () => {
    jest.spyOn(safeTxSigner, 'checkIfOffChainSignatureIsPossible').mockImplementation(() => true)
    const sender = new TxSender()

    mockTxProps.navigateToTransactionsTab = true

    await sender.prepare(jest.fn(), store.getState(), mockTxProps)

    sender.isFinalization = false
    sender.safeTxHash = ''
    sender.txArgs = {
      safeInstance: sender.safeInstance,
      to: mockTxProps.to,
      valueInWei: mockTxProps.valueInWei,
      data: mockTxProps.txData,
      operation: mockTxProps.operation,
      nonce: Number.parseInt(sender.nonce),
      safeTxGas: mockTxProps.safeTxGas,
      baseGas: '0',
      gasPrice: '0',
      gasToken: ZERO_ADDRESS,
      refundReceiver: ZERO_ADDRESS,
      sender: mockTxProps.from,
      sigs: '',
    }

    sender.submitTx()

    await waitFor(() => {
      expect(tryOffChainSigningSpy).toHaveBeenCalledTimes(1)
      expect(saveTxToHistorySpy).toHaveBeenCalledTimes(1)
      expect(addPendingTransactionSpy).toHaveBeenCalledTimes(0)
      expect(navigateToTxSpy).toHaveBeenCalledTimes(1)
      expect(fetchTransactionsSpy).toHaveBeenCalledTimes(1)
    })
  })

  it('handles immediately executing a transaction', async () => {
    jest.spyOn(safeTxSigner, 'checkIfOffChainSignatureIsPossible').mockImplementation(() => false)
    const setNonceSpy = jest.spyOn(aboutToExecuteTx, 'setNonce')
    const getExecutionTransactionSpy = jest.spyOn(send, 'getExecutionTransaction').mockImplementation(() => ({
      arguments: [],
      call: jest.fn(),
      send: jest.fn(() => ({
        ...mockPromiEvent,
        once: jest.fn((type, handler) => {
          handler('mocktxhash')
          return mockPromiEvent
        }),
      })) as any,
      estimateGas: jest.fn(),
      encodeABI: jest.fn(),
    }))
    saveTxToHistorySpy = jest
      .spyOn(txHistory, 'saveTxToHistory')
      .mockImplementation(() => Promise.resolve({ ...mockTransactionDetails, txId: 'mockId' } as any))

    const sender = new TxSender()

    mockTxProps.navigateToTransactionsTab = true

    await sender.prepare(jest.fn(), store.getState(), mockTxProps)

    sender.isFinalization = true
    sender.safeTxHash = ''
    sender.txArgs = {
      safeInstance: sender.safeInstance,
      to: mockTxProps.to,
      valueInWei: mockTxProps.valueInWei,
      data: mockTxProps.txData,
      operation: mockTxProps.operation,
      nonce: Number.parseInt(sender.nonce),
      safeTxGas: mockTxProps.safeTxGas,
      baseGas: '0',
      gasPrice: '0',
      gasToken: ZERO_ADDRESS,
      refundReceiver: ZERO_ADDRESS,
      sender: mockTxProps.from,
      sigs: '',
    }

    sender.submitTx()

    await waitFor(() => {
      expect(getExecutionTransactionSpy).toHaveBeenCalledTimes(1)
      expect(setNonceSpy).toHaveBeenCalledTimes(1)
      expect(saveTxToHistorySpy).toHaveBeenCalledTimes(1)
      expect(addPendingTransactionSpy).toHaveBeenCalledTimes(1)
      expect(navigateToTxSpy).toHaveBeenCalledTimes(1)
      expect(fetchTransactionsSpy).toHaveBeenCalledTimes(1)
    })
  })

  it('handles executing a transaction', async () => {
    jest.spyOn(safeTxSigner, 'checkIfOffChainSignatureIsPossible').mockImplementation(() => false)
    const setNonceSpy = jest.spyOn(aboutToExecuteTx, 'setNonce')
    const getExecutionTransactionSpy = jest.spyOn(send, 'getExecutionTransaction').mockImplementation(() => ({
      arguments: [],
      call: jest.fn(),
      send: jest.fn(() => ({
        ...mockPromiEvent,
        once: jest.fn((type, handler) => {
          handler('mocktxhash')
          return mockPromiEvent
        }),
      })) as any,
      estimateGas: jest.fn(),
      encodeABI: jest.fn(),
    }))

    const sender = new TxSender()

    await sender.prepare(jest.fn(), store.getState(), mockTxProps)

    sender.isFinalization = true
    sender.txId = 'mockId'
    sender.safeTxHash = ''
    sender.txArgs = {
      safeInstance: sender.safeInstance,
      to: mockTxProps.to,
      valueInWei: mockTxProps.valueInWei,
      data: mockTxProps.txData,
      operation: mockTxProps.operation,
      nonce: Number.parseInt(sender.nonce),
      safeTxGas: mockTxProps.safeTxGas,
      baseGas: '0',
      gasPrice: '0',
      gasToken: ZERO_ADDRESS,
      refundReceiver: ZERO_ADDRESS,
      sender: mockTxProps.from,
      sigs: '',
    }

    sender.submitTx()

    await waitFor(() => {
      expect(getExecutionTransactionSpy).toHaveBeenCalledTimes(1)
      expect(setNonceSpy).toHaveBeenCalledTimes(1)
      expect(addPendingTransactionSpy).toHaveBeenCalledTimes(1)
      expect(saveTxToHistorySpy).toHaveBeenCalledTimes(0)
      expect(navigateToTxSpy).toHaveBeenCalledTimes(0)
      expect(fetchTransactionsSpy).toHaveBeenCalledTimes(1)
    })
  })
})
