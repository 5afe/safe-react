import { TxSender } from 'src/logic/safe/store/actions/createTransaction'
import { EMPTY_DATA } from 'src/logic/wallets/ethTransactions'
import { store } from 'src/store'
import { ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'
import * as ConnectButton from 'src/components/ConnectButton'
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
import { waitFor } from '@testing-library/react'
import { addPendingTransaction } from 'src/logic/safe/store/actions/pendingTransactions'
import { LocalTransactionStatus } from 'src/logic/safe/store/models/types/gateway.d'

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

describe('TxSender', () => {
  let tryOffChainSigningSpy, saveTxToHistorySpy, addPendingTransactionSpy, navigateToTxSpy, fetchTransactionsSpy

  beforeEach(() => {
    jest.restoreAllMocks()
    jest.spyOn(ConnectButton, 'onboardUser').mockImplementation(() => Promise.resolve(true))
    jest.spyOn(utils, 'getNonce')
    jest.spyOn(safeSelectors, 'currentSafeCurrentVersion')
    jest.spyOn(walletSelectors, 'providerSelector')
    jest.spyOn(safeContracts, 'getGnosisSafeInstanceAt')
    jest.spyOn(notificationBuilder, 'createTxNotifications')
    tryOffChainSigningSpy = jest.spyOn(offChainSigner, 'tryOffChainSigning')
    saveTxToHistorySpy = jest
      .spyOn(txHistory, 'saveTxToHistory')
      .mockImplementation(() => Promise.resolve(mockTransactionDetails as any))
    addPendingTransactionSpy = jest.spyOn(pendingTransactions, 'addPendingTransaction')
    navigateToTxSpy = jest.spyOn(utils, 'navigateToTx')
    fetchTransactionsSpy = jest.spyOn(fetchTransactions, 'default')
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

    sender.submitTx(store.getState())

    await waitFor(() => {
      expect(tryOffChainSigningSpy).toHaveBeenCalledTimes(1)
      expect(saveTxToHistorySpy).toHaveBeenCalledTimes(1)
      expect(addPendingTransactionSpy).toHaveBeenCalledTimes(0)
      expect(navigateToTxSpy).toHaveBeenCalledTimes(0)
      expect(fetchTransactionsSpy).toHaveBeenCalledTimes(1)
    })
  })

  it('handles creating a transaction', async () => {
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

    sender.submitTx(store.getState())

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
        once: jest.fn((type, handler) => handler()) as any,
        on: jest.fn(),
        then: jest.fn(),
        catch: jest.fn((type, handler) => handler()) as any,
        finally: jest.fn(),
        [Symbol.toStringTag]: '',
      })),
      estimateGas: jest.fn(),
      encodeABI: jest.fn(),
    }))

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

    sender.submitTx(store.getState())

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
        once: jest.fn((type, handler) => handler()) as any,
        on: jest.fn(),
        then: jest.fn(),
        catch: jest.fn((type, handler) => handler()) as any,
        finally: jest.fn(),
        [Symbol.toStringTag]: '',
      })),
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

    sender.submitTx(store.getState())

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
