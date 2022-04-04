import {
  ConflictHeader,
  Label,
  LabelValue,
  MultisigExecutionInfo,
  Transaction,
  TransactionStatus,
  TransactionSummary,
  TransactionTokenType,
  TransferDirection,
} from '@gnosis.pm/safe-react-gateway-sdk'

import gatewayTransactionsReducer, {
  GatewayTransactionsState,
  QueuedPayload,
} from 'src/logic/safe/store/reducer/gatewayTransactions'
import { ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'
import { addQueuedTransactions } from '../../actions/transactions/gatewayTransactions'

const EMPTY_STATE: GatewayTransactionsState = {
  4: {
    [ZERO_ADDRESS]: {
      queued: {
        next: {},
        queued: {},
      },
      history: {},
    },
  },
}

const MOCK_TX_META: Omit<Transaction, 'transaction'> = {
  conflictType: 'None',
  type: 'TRANSACTION',
}

describe('gatewayTransactionsReducer', () => {
  describe('ADD_QUEUED_TRANSACTIONS', () => {
    const NEXT_LABEL: Label = {
      label: LabelValue.Next,
      type: 'LABEL',
    }

    const QUEUED_LABEL: Label = {
      label: LabelValue.Queued,
      type: 'LABEL',
    }

    // Must be declared separately to appease TypeScript
    const MOCK_MULTISIG_EXECUTION_INFO: MultisigExecutionInfo = {
      nonce: 0,
      type: 'MULTISIG',
      confirmationsRequired: 2,
      confirmationsSubmitted: 2,
      missingSigners: null,
    }

    const MOCK_TX_SUMMARY: Omit<TransactionSummary, 'id'> = {
      timestamp: 0,
      txStatus: TransactionStatus.AWAITING_EXECUTION,
      txInfo: {
        type: 'Transfer',
        sender: { value: '', name: null, logoUri: null },
        recipient: { value: '', name: null, logoUri: null },
        direction: TransferDirection.OUTGOING,
        transferInfo: {
          type: TransactionTokenType.NATIVE_COIN,
          value: '',
        },
      },
      executionInfo: MOCK_MULTISIG_EXECUTION_INFO,
    }

    it('handles payloads with multiple transactions of the same label/same nonce', () => {
      const mockTx: Transaction = {
        transaction: { id: 'sdfgdsfgdsfgdfgfd', ...MOCK_TX_SUMMARY },
        ...MOCK_TX_META,
      }
      const mockTx2: Transaction = {
        transaction: { id: 'sg5be475eb5yydrtyhgtdr', ...MOCK_TX_SUMMARY },
        ...MOCK_TX_META,
      }
      const mockTx3: Transaction = {
        transaction: { id: 'cxsewec5tce5', ...MOCK_TX_SUMMARY },
        ...MOCK_TX_META,
      }

      const mockPayload: QueuedPayload = {
        chainId: '4',
        safeAddress: ZERO_ADDRESS,
        values: [NEXT_LABEL, mockTx, mockTx2, mockTx3],
      }

      const newState = gatewayTransactionsReducer(EMPTY_STATE, addQueuedTransactions(mockPayload))

      const expectedState: GatewayTransactionsState = {
        4: {
          [ZERO_ADDRESS]: {
            queued: {
              next: {
                0: [mockTx.transaction, mockTx2.transaction, mockTx3.transaction],
              },
              queued: {},
            },
            history: {},
          },
        },
      }

      expect(newState).toEqual(expectedState)
    })

    it('handles payloads with multiple transactions with varying labels', () => {
      const mockNextTx: Transaction = {
        transaction: { id: 'btr6uy5r6rbfghhjg', ...MOCK_TX_SUMMARY },
        ...MOCK_TX_META,
      }
      const mockQueuedTx: Transaction = {
        transaction: {
          id: 'dbfyujndftyiuft7yuiftyu',
          ...MOCK_TX_SUMMARY,
          executionInfo: {
            ...MOCK_MULTISIG_EXECUTION_INFO,
            nonce: 1,
          },
        },
        ...MOCK_TX_META,
      }
      const mockQueuedTx2: Transaction = {
        ...mockQueuedTx,
        transaction: {
          ...mockQueuedTx.transaction,
          id: '123',
        },
      }

      const mockPayload: QueuedPayload = {
        chainId: '4',
        safeAddress: ZERO_ADDRESS,
        values: [
          NEXT_LABEL,
          mockNextTx,
          QUEUED_LABEL, // Different label
          mockQueuedTx,
          mockQueuedTx2,
        ],
      }

      const newState = gatewayTransactionsReducer(EMPTY_STATE, addQueuedTransactions(mockPayload))

      const expectedState: GatewayTransactionsState = {
        4: {
          [ZERO_ADDRESS]: {
            queued: {
              next: {
                0: [mockNextTx.transaction],
              },
              queued: {
                1: [mockQueuedTx.transaction, mockQueuedTx2.transaction],
              },
            },
            history: {},
          },
        },
      }

      expect(newState).toEqual(expectedState)
    })

    it('defaults to a `queued.next` if there is no label and previous state', () => {
      const mockTx: Transaction = {
        transaction: { id: 'dfgbh65rb5yrthhdft', ...MOCK_TX_SUMMARY },
        ...MOCK_TX_META,
      }

      const mockPayload: QueuedPayload = {
        chainId: '4',
        safeAddress: ZERO_ADDRESS,
        values: [mockTx], // No label
      }

      const newState = gatewayTransactionsReducer(EMPTY_STATE, addQueuedTransactions(mockPayload))

      const expectedState: GatewayTransactionsState = {
        4: {
          [ZERO_ADDRESS]: {
            queued: {
              next: {
                0: [mockTx.transaction],
              },
              queued: {},
            },
            history: {},
          },
        },
      }

      expect(newState).toEqual(expectedState)
    })

    it('removes conflict headers', () => {
      const mockConflicHeader: ConflictHeader = {
        nonce: 0,
        type: 'CONFLICT_HEADER',
      }

      const mockPayload: QueuedPayload = {
        chainId: '4',
        safeAddress: ZERO_ADDRESS,
        values: [mockConflicHeader],
      }

      const newState = gatewayTransactionsReducer(EMPTY_STATE, addQueuedTransactions(mockPayload))

      expect(newState).toEqual(EMPTY_STATE)
    })

    it('adds `queued.queued` transactions to different nonce keys if the nonce differs between then', () => {
      const mockTx: Transaction = {
        transaction: { id: 'sdfgdsfgdsfgdfgfd', ...MOCK_TX_SUMMARY },
        ...MOCK_TX_META,
      }
      const mockTx2: Transaction = {
        transaction: {
          id: 'sg5be475eb5yydrtyhgtdr',
          ...MOCK_TX_SUMMARY,
          executionInfo: {
            ...MOCK_MULTISIG_EXECUTION_INFO,
            nonce: 1,
          },
        },
        ...MOCK_TX_META,
      }
      const mockTx3: Transaction = {
        transaction: {
          id: 'cxsewec5tce5',
          ...MOCK_TX_SUMMARY,
          executionInfo: {
            ...MOCK_MULTISIG_EXECUTION_INFO,
            nonce: 2,
          },
        },
        ...MOCK_TX_META,
      }

      const mockPayload: QueuedPayload = {
        chainId: '4',
        safeAddress: ZERO_ADDRESS,
        values: [QUEUED_LABEL, mockTx, mockTx2, mockTx3],
      }

      const newState = gatewayTransactionsReducer(EMPTY_STATE, addQueuedTransactions(mockPayload))

      const expectedState: GatewayTransactionsState = {
        4: {
          [ZERO_ADDRESS]: {
            queued: {
              next: {},
              queued: {
                0: [mockTx.transaction],
                1: [mockTx2.transaction],
                2: [mockTx3.transaction],
              },
            },
            history: {},
          },
        },
      }

      expect(newState).toEqual(expectedState)
    })
  })
})
