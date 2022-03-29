import {
  ConflictHeader,
  Label,
  MultisigExecutionInfo,
  Transaction,
  TransactionDetails,
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
      label: 'next',
      type: 'LABEL',
    }

    const QUEUED_LABEL: Label = {
      label: 'queued',
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

    const MOCK_TX_DETAILS: Omit<TransactionDetails, 'txId' | 'txStatus'> = {
      executedAt: null,
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
      txData: null,
      detailedExecutionInfo: null,
      txHash: null,
      safeAppInfo: null,
    }

    it('adds `queued.queued` transaction summaries', () => {
      const mockTx: Transaction = {
        transaction: {
          id: 'sdifhgsiodugheiorjngnegerg',
          ...MOCK_TX_SUMMARY,
        },
        ...MOCK_TX_META,
      }

      const mockPayload: QueuedPayload = {
        chainId: '4',
        safeAddress: ZERO_ADDRESS,
        values: [QUEUED_LABEL, mockTx],
      }

      const newState = gatewayTransactionsReducer(EMPTY_STATE, addQueuedTransactions(mockPayload))

      const expectedState: GatewayTransactionsState = {
        4: {
          [ZERO_ADDRESS]: {
            queued: {
              next: {},
              queued: {
                0: [mockTx.transaction],
              },
            },
            history: {},
          },
        },
      }

      expect(newState).toEqual(expectedState)
    })
    it('adds `queued.next` transaction summaries', () => {
      const mockTx: Transaction = {
        transaction: {
          id: 'sdfgsergrse5gsr5ghsxdfgh',
          ...MOCK_TX_SUMMARY,
          txStatus: TransactionStatus.AWAITING_CONFIRMATIONS,
          executionInfo: {
            ...MOCK_MULTISIG_EXECUTION_INFO,
            confirmationsSubmitted: 0,
          },
        },
        ...MOCK_TX_META,
      }

      const mockPayload: QueuedPayload = {
        chainId: '4',
        safeAddress: ZERO_ADDRESS,
        values: [NEXT_LABEL, mockTx],
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
        values: [QUEUED_LABEL, mockTx, mockTx2, mockTx3],
      }

      const newState = gatewayTransactionsReducer(EMPTY_STATE, addQueuedTransactions(mockPayload))

      const expectedState: GatewayTransactionsState = {
        4: {
          [ZERO_ADDRESS]: {
            queued: {
              next: {},
              queued: {
                0: [mockTx.transaction, mockTx2.transaction, mockTx3.transaction],
              },
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

      const mockPayload: QueuedPayload = {
        chainId: '4',
        safeAddress: ZERO_ADDRESS,
        values: [
          NEXT_LABEL,
          mockNextTx,
          QUEUED_LABEL, // Different label
          mockQueuedTx,
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
                1: [mockQueuedTx.transaction],
              },
            },
            history: {},
          },
        },
      }

      expect(newState).toEqual(expectedState)
    })

    it('sets the label to `queued.next` if there is no label and the transaction is already loaded under `queued.next', () => {
      const mockTx: Transaction = {
        transaction: { id: 'dfgbh65rb5yrthhdft', ...MOCK_TX_SUMMARY },
        ...MOCK_TX_META,
      }

      const mockPayload: QueuedPayload = {
        chainId: '4',
        safeAddress: ZERO_ADDRESS,
        values: [mockTx],
      }

      const prevState: GatewayTransactionsState = {
        4: {
          [ZERO_ADDRESS]: {
            queued: {
              next: { 0: [mockTx.transaction] },
              queued: {},
            },
            history: {},
          },
        },
      }

      const newState = gatewayTransactionsReducer(prevState, addQueuedTransactions(mockPayload))

      const expectedState: GatewayTransactionsState = {
        4: {
          [ZERO_ADDRESS]: {
            queued: {
              next: { 0: [mockTx.transaction] },
              queued: {},
            },
            history: {},
          },
        },
      }

      expect(newState).toEqual(expectedState)
    })

    it('defaults to a `queued.queued` if there is no label and previous state', () => {
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
              next: {},
              queued: {
                0: [mockTx.transaction],
              },
            },
            history: {},
          },
        },
      }

      expect(newState).toEqual(expectedState)
    })

    it('does not add transactions without a nonce to be added', () => {
      const mockTx: Transaction = {
        transaction: {
          id: 'dfgbh65rb5yrthhdft',
          ...MOCK_TX_SUMMARY,
          executionInfo: {
            ...MOCK_MULTISIG_EXECUTION_INFO,
            nonce: undefined as unknown as number, // Remove nonce
          },
        },
        ...MOCK_TX_META,
      }

      const mockPayload: QueuedPayload = {
        chainId: '4',
        safeAddress: ZERO_ADDRESS,
        values: [mockTx],
      }

      const newState = gatewayTransactionsReducer(EMPTY_STATE, addQueuedTransactions(mockPayload))

      expect(newState).toEqual(EMPTY_STATE)
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

    it('merges existing `queued.queued` transactions', () => {
      const mockTx: Transaction = {
        transaction: { id: 'gsdfgsdfgfdgsf', ...MOCK_TX_SUMMARY },
        ...MOCK_TX_META,
      }

      const mockPayload: QueuedPayload = {
        chainId: '4',
        safeAddress: ZERO_ADDRESS,
        values: [QUEUED_LABEL, mockTx],
      }

      const prevState: GatewayTransactionsState = {
        4: {
          [ZERO_ADDRESS]: {
            queued: {
              next: {},
              queued: {
                0: [
                  {
                    ...mockTx.transaction,
                    // Would have been added via `UPDATE_TRANSACTION_DETAILS`
                    txDetails: {
                      txId: mockTx.transaction.id,
                      txStatus: mockTx.transaction.txStatus,
                      ...MOCK_TX_DETAILS,
                    },
                  },
                ],
              },
            },
            history: {},
          },
        },
      }

      const newState = gatewayTransactionsReducer(prevState, addQueuedTransactions(mockPayload))

      // Should remain the same as it keeps the `txDetails` via merge
      expect(newState).toEqual(prevState)
    })

    it('sorts `queued.queued` transactions by ascending timestamp when adding a new transaction', () => {
      const mockOldestTx = {
        transaction: { id: 'gsdfgsdfgfdgsf', ...MOCK_TX_SUMMARY }, // Timestamp of 0
        ...MOCK_TX_META,
      }
      const mockOldTx = {
        transaction: { id: 'sdgbfghsdfhsd', ...MOCK_TX_SUMMARY, timestamp: 1 },
        ...MOCK_TX_META,
      }
      const mockNewTx = {
        transaction: { id: 'ser5464e5s45', ...MOCK_TX_SUMMARY, timestamp: 2 },
        ...MOCK_TX_META,
      }
      const mockNewestTx = {
        transaction: { id: 'sdegrsdh656', ...MOCK_TX_SUMMARY, timestamp: 3 },
        ...MOCK_TX_META,
      }

      const mockPayload: QueuedPayload = {
        chainId: '4',
        safeAddress: ZERO_ADDRESS,
        values: [QUEUED_LABEL, mockNewTx, mockOldestTx, mockNewestTx, mockOldTx],
      }

      const newState = gatewayTransactionsReducer(EMPTY_STATE, addQueuedTransactions(mockPayload))

      const expectedState = {
        4: {
          [ZERO_ADDRESS]: {
            queued: {
              next: {},
              queued: {
                0: [mockOldestTx.transaction, mockOldTx.transaction, mockNewTx.transaction, mockNewestTx.transaction],
              },
            },
            history: {},
          },
        },
      }

      expect(newState).toEqual(expectedState)
    })

    it('merges existing `queued.next` transactions', () => {
      const mockTx: Transaction = {
        transaction: { id: 'gsdfgsdfgfdgsf', ...MOCK_TX_SUMMARY },
        ...MOCK_TX_META,
      }

      const mockPayload: QueuedPayload = {
        chainId: '4',
        safeAddress: ZERO_ADDRESS,
        values: [NEXT_LABEL, mockTx],
      }

      const prevState: GatewayTransactionsState = {
        4: {
          [ZERO_ADDRESS]: {
            queued: {
              queued: {},
              next: {
                0: [
                  {
                    ...mockTx.transaction,
                    // Would have been added via `UPDATE_TRANSACTION_DETAILS`
                    txDetails: {
                      txId: mockTx.transaction.id,
                      txStatus: mockTx.transaction.txStatus,
                      ...MOCK_TX_DETAILS,
                    },
                  },
                ],
              },
            },
            history: {},
          },
        },
      }

      const newState = gatewayTransactionsReducer(prevState, addQueuedTransactions(mockPayload))

      // Should remain the same as it keeps the `txDetails` via merge
      expect(newState).toEqual(prevState)
    })

    it('sorts `queued.next` transactions by timestamp when adding a new transaction', () => {
      const mockOldestTx = {
        transaction: { id: 'gsdfgsdfgfdgsf', ...MOCK_TX_SUMMARY }, // Timestamp of 0
        ...MOCK_TX_META,
      }
      const mockOldTx = {
        transaction: { id: 'sdgbfghsdfhsd', ...MOCK_TX_SUMMARY, timestamp: 1 },
        ...MOCK_TX_META,
      }
      const mockNewTx = {
        transaction: { id: 'ser5464e5s45', ...MOCK_TX_SUMMARY, timestamp: 2 },
        ...MOCK_TX_META,
      }
      const mockNewestTx = {
        transaction: { id: 'sdegrsdh656', ...MOCK_TX_SUMMARY, timestamp: 3 },
        ...MOCK_TX_META,
      }

      const mockPayload: QueuedPayload = {
        chainId: '4',
        safeAddress: ZERO_ADDRESS,
        values: [NEXT_LABEL, mockNewTx, mockOldestTx, mockNewestTx, mockOldTx],
      }

      const newState = gatewayTransactionsReducer(EMPTY_STATE, addQueuedTransactions(mockPayload))

      const expectedState = {
        4: {
          [ZERO_ADDRESS]: {
            queued: {
              next: {
                0: [mockOldestTx.transaction, mockOldTx.transaction, mockNewTx.transaction, mockNewestTx.transaction],
              },
              queued: {},
            },
            history: {},
          },
        },
      }

      expect(newState).toEqual(expectedState)
    })

    it('replaces `queued.queued` transactions if there are new confirmations', () => {
      const mockTx: Transaction = {
        transaction: { id: 'gsdfgsdfgfdgsf', ...MOCK_TX_SUMMARY },
        ...MOCK_TX_META,
      }

      const mockPayload: QueuedPayload = {
        chainId: '4',
        safeAddress: ZERO_ADDRESS,
        values: [QUEUED_LABEL, mockTx],
      }

      const prevState: GatewayTransactionsState = {
        4: {
          [ZERO_ADDRESS]: {
            queued: {
              next: {},
              queued: {
                0: [
                  {
                    ...mockTx.transaction,
                    executionInfo: {
                      ...MOCK_MULTISIG_EXECUTION_INFO,
                      confirmationsSubmitted: 0,
                    },
                    // Would have been added via `UPDATE_TRANSACTION_DETAILS`
                    txDetails: {
                      txId: mockTx.transaction.id,
                      txStatus: mockTx.transaction.txStatus,
                      ...MOCK_TX_DETAILS,
                    },
                  },
                ],
              },
            },
            history: {},
          },
        },
      }

      const newState = gatewayTransactionsReducer(prevState, addQueuedTransactions(mockPayload))

      const expectedState: GatewayTransactionsState = {
        4: {
          [ZERO_ADDRESS]: {
            queued: {
              next: {},
              queued: {
                // Removed `txDetails`, using the payload transaction instead
                0: [mockTx.transaction],
              },
            },
            history: {},
          },
        },
      }

      expect(newState).toEqual(expectedState)
    })
    it('replaces `queued.next` transactions if there are new confirmations', () => {
      const mockTx: Transaction = {
        transaction: { id: 'gsdfgsdfgfdgsf', ...MOCK_TX_SUMMARY },
        ...MOCK_TX_META,
      }

      const mockPayload: QueuedPayload = {
        chainId: '4',
        safeAddress: ZERO_ADDRESS,
        values: [NEXT_LABEL, mockTx],
      }

      const prevState: GatewayTransactionsState = {
        4: {
          [ZERO_ADDRESS]: {
            queued: {
              next: {
                0: [
                  {
                    ...mockTx.transaction,
                    executionInfo: {
                      ...MOCK_MULTISIG_EXECUTION_INFO,
                      confirmationsSubmitted: 0,
                    },
                    // Would have been added via `UPDATE_TRANSACTION_DETAILS`
                    txDetails: {
                      txId: mockTx.transaction.id,
                      txStatus: mockTx.transaction.txStatus,
                      ...MOCK_TX_DETAILS,
                    },
                  },
                ],
              },
              queued: {},
            },
            history: {},
          },
        },
      }

      const newState = gatewayTransactionsReducer(prevState, addQueuedTransactions(mockPayload))

      const expectedState: GatewayTransactionsState = {
        4: {
          [ZERO_ADDRESS]: {
            queued: {
              next: {
                // Removed `txDetails`, using the payload transaction instead
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
    it('removes the transaction that moves from `queued.queued` to `queued.next`', () => {
      const mockTx: Transaction = {
        transaction: { id: 'sdfgsdfgdsfg', ...MOCK_TX_SUMMARY },
        ...MOCK_TX_META,
      }

      const mockPayload: QueuedPayload = {
        chainId: '4',
        safeAddress: ZERO_ADDRESS,
        values: [NEXT_LABEL, mockTx],
      }

      const prevState: GatewayTransactionsState = {
        4: {
          [ZERO_ADDRESS]: {
            queued: {
              next: {},
              queued: {
                0: [mockTx.transaction],
              },
            },
            history: {},
          },
        },
      }

      const newState = gatewayTransactionsReducer(prevState, addQueuedTransactions(mockPayload))

      const expectedState: GatewayTransactionsState = {
        4: {
          [ZERO_ADDRESS]: {
            queued: {
              next: {
                0: [mockTx.transaction],
              },
              queued: {}, // Transaction removed
            },
            history: {},
          },
        },
      }

      expect(newState).toEqual(expectedState)
    })
    it('resets the `queued.next` if there are no `queued` transactions at all', () => {
      const mockTx: Transaction = {
        transaction: { id: 'sdfgsdfgdsfg', ...MOCK_TX_SUMMARY },
        ...MOCK_TX_META,
      }

      const mockPayload: QueuedPayload = {
        chainId: '4',
        safeAddress: ZERO_ADDRESS,
        values: [],
      }

      const prevState: GatewayTransactionsState = {
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

      const newState = gatewayTransactionsReducer(prevState, addQueuedTransactions(mockPayload))

      const expectedState: GatewayTransactionsState = {
        4: {
          [ZERO_ADDRESS]: {
            queued: {
              next: {}, // Next cleared
              queued: {},
            },
            history: {},
          },
        },
      }

      expect(newState).toEqual(expectedState)
    })
  })
})
