import { Label, TransactionStatus, TransactionTokenType, TransferDirection } from '@gnosis.pm/safe-react-gateway-sdk'

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

    it('adds `queued.queued` transaction summaries', () => {
      const testPayload: QueuedPayload = {
        chainId: '4',
        safeAddress: ZERO_ADDRESS,
        values: [
          QUEUED_LABEL,
          {
            transaction: {
              id: 'sdfgdsfgdsfgdfgfd',
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
              executionInfo: {
                nonce: 0,
                type: 'MULTISIG',
                confirmationsRequired: 2,
                confirmationsSubmitted: 2,
                missingSigners: null,
              },
            },
            conflictType: 'None',
            type: 'TRANSACTION',
          },
        ],
      }

      const expectedState: GatewayTransactionsState = {
        4: {
          [ZERO_ADDRESS]: {
            queued: {
              next: {},
              queued: {
                0: [
                  {
                    id: 'sdfgdsfgdsfgdfgfd',
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
                    executionInfo: {
                      nonce: 0,
                      type: 'MULTISIG',
                      confirmationsRequired: 2,
                      confirmationsSubmitted: 2,
                      missingSigners: null,
                    },
                  },
                ],
              },
            },
            history: {},
          },
        },
      }

      const newState = gatewayTransactionsReducer(EMPTY_STATE, addQueuedTransactions(testPayload))

      expect(newState).toEqual(expectedState)
    })
    it('adds `queued.next` transaction summaries', () => {
      const testPayload: QueuedPayload = {
        chainId: '4',
        safeAddress: ZERO_ADDRESS,
        values: [
          NEXT_LABEL,
          {
            transaction: {
              id: '356as4tse34',
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
              executionInfo: {
                nonce: 0,
                type: 'MULTISIG',
                confirmationsRequired: 2,
                confirmationsSubmitted: 2,
                missingSigners: null,
              },
            },
            conflictType: 'None',
            type: 'TRANSACTION',
          },
        ],
      }

      const expectedState: GatewayTransactionsState = {
        4: {
          [ZERO_ADDRESS]: {
            queued: {
              next: {
                0: [
                  {
                    id: '356as4tse34',
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
                    executionInfo: {
                      nonce: 0,
                      type: 'MULTISIG',
                      confirmationsRequired: 2,
                      confirmationsSubmitted: 2,
                      missingSigners: null,
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

      const newState = gatewayTransactionsReducer(EMPTY_STATE, addQueuedTransactions(testPayload))

      expect(newState).toEqual(expectedState)
    })
    it('handles payloads with multiple transactions of the same label', () => {
      const testPayload: QueuedPayload = {
        chainId: '4',
        safeAddress: ZERO_ADDRESS,
        values: [
          QUEUED_LABEL,
          {
            transaction: {
              id: 'sdfgdsfgdsfgdfgfd',
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
              executionInfo: {
                nonce: 0,
                type: 'MULTISIG',
                confirmationsRequired: 2,
                confirmationsSubmitted: 2,
                missingSigners: null,
              },
            },
            conflictType: 'None',
            type: 'TRANSACTION',
          },
          {
            transaction: {
              id: 'fdhdfhdrtthydfrthrdfht',
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
              executionInfo: {
                nonce: 0,
                type: 'MULTISIG',
                confirmationsRequired: 2,
                confirmationsSubmitted: 2,
                missingSigners: null,
              },
            },
            conflictType: 'None',
            type: 'TRANSACTION',
          },
          {
            transaction: {
              id: 've5dry5rvd45vyrthdtrfy',
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
              executionInfo: {
                nonce: 0,
                type: 'MULTISIG',
                confirmationsRequired: 2,
                confirmationsSubmitted: 2,
                missingSigners: null,
              },
            },
            conflictType: 'None',
            type: 'TRANSACTION',
          },
        ],
      }

      const expectedState: GatewayTransactionsState = {
        4: {
          [ZERO_ADDRESS]: {
            queued: {
              next: {},
              queued: {
                0: [
                  {
                    id: 'sdfgdsfgdsfgdfgfd',
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
                    executionInfo: {
                      nonce: 0,
                      type: 'MULTISIG',
                      confirmationsRequired: 2,
                      confirmationsSubmitted: 2,
                      missingSigners: null,
                    },
                  },
                  {
                    id: 'fdhdfhdrtthydfrthrdfht',
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
                    executionInfo: {
                      nonce: 0,
                      type: 'MULTISIG',
                      confirmationsRequired: 2,
                      confirmationsSubmitted: 2,
                      missingSigners: null,
                    },
                  },
                  {
                    id: 've5dry5rvd45vyrthdtrfy',
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
                    executionInfo: {
                      nonce: 0,
                      type: 'MULTISIG',
                      confirmationsRequired: 2,
                      confirmationsSubmitted: 2,
                      missingSigners: null,
                    },
                  },
                ],
              },
            },
            history: {},
          },
        },
      }

      const newState = gatewayTransactionsReducer(EMPTY_STATE, addQueuedTransactions(testPayload))

      expect(newState).toEqual(expectedState)
    })
    it('handles payloads with multiple transactions with varying labels', () => {
      const testPayload: QueuedPayload = {
        chainId: '4',
        safeAddress: ZERO_ADDRESS,
        values: [
          NEXT_LABEL,
          {
            transaction: {
              id: 'sv4tew4t45e4t4e',
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
              executionInfo: {
                nonce: 0,
                type: 'MULTISIG',
                confirmationsRequired: 2,
                confirmationsSubmitted: 2,
                missingSigners: null,
              },
            },
            conflictType: 'None',
            type: 'TRANSACTION',
          },
          QUEUED_LABEL, // Different label
          {
            transaction: {
              id: 'sdfgsdfgdsfg',
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
              executionInfo: {
                nonce: 1,
                type: 'MULTISIG',
                confirmationsRequired: 2,
                confirmationsSubmitted: 2,
                missingSigners: null,
              },
            },
            conflictType: 'None',
            type: 'TRANSACTION',
          },
        ],
      }

      const expectedState: GatewayTransactionsState = {
        4: {
          [ZERO_ADDRESS]: {
            queued: {
              next: {
                0: [
                  {
                    id: 'sv4tew4t45e4t4e',
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
                    executionInfo: {
                      nonce: 0,
                      type: 'MULTISIG',
                      confirmationsRequired: 2,
                      confirmationsSubmitted: 2,
                      missingSigners: null,
                    },
                  },
                ],
              },
              queued: {
                1: [
                  {
                    id: 'sdfgsdfgdsfg',
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
                    executionInfo: {
                      nonce: 1,
                      type: 'MULTISIG',
                      confirmationsRequired: 2,
                      confirmationsSubmitted: 2,
                      missingSigners: null,
                    },
                  },
                ],
              },
            },
            history: {},
          },
        },
      }

      const newState = gatewayTransactionsReducer(EMPTY_STATE, addQueuedTransactions(testPayload))

      expect(newState).toEqual(expectedState)
    })

    it('defaults to a `queued.queued` if no label is present', () => {
      const testPayload: QueuedPayload = {
        chainId: '4',
        safeAddress: ZERO_ADDRESS,
        // No label
        values: [
          {
            transaction: {
              id: '4v5eydrtdyrtyxcrt',
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
              executionInfo: {
                nonce: 0,
                type: 'MULTISIG',
                confirmationsRequired: 2,
                confirmationsSubmitted: 2,
                missingSigners: null,
              },
            },
            conflictType: 'None',
            type: 'TRANSACTION',
          },
        ],
      }

      const expectedState: GatewayTransactionsState = {
        4: {
          [ZERO_ADDRESS]: {
            queued: {
              next: {},
              queued: {
                0: [
                  {
                    id: '4v5eydrtdyrtyxcrt',
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
                    executionInfo: {
                      nonce: 0,
                      type: 'MULTISIG',
                      confirmationsRequired: 2,
                      confirmationsSubmitted: 2,
                      missingSigners: null,
                    },
                  },
                ],
              },
            },
            history: {},
          },
        },
      }

      const newState = gatewayTransactionsReducer(EMPTY_STATE, addQueuedTransactions(testPayload))

      expect(newState).toEqual(expectedState)
    })

    it('does not add transactions without a nonce to be added', () => {
      const testPayload: QueuedPayload = {
        chainId: '4',
        safeAddress: ZERO_ADDRESS,
        values: [
          NEXT_LABEL,
          {
            transaction: {
              id: '5bhrt6byftghfg',
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
              executionInfo: {
                nonce: undefined as unknown as number, // No nonce
                type: 'MULTISIG',
                confirmationsRequired: 2,
                confirmationsSubmitted: 2,
                missingSigners: null,
              },
            },
            conflictType: 'None',
            type: 'TRANSACTION',
          },
        ],
      }

      const newState = gatewayTransactionsReducer(EMPTY_STATE, addQueuedTransactions(testPayload))

      expect(newState).toEqual(EMPTY_STATE)
    })

    it('removes conflict headers', () => {
      const testPayload: QueuedPayload = {
        chainId: '4',
        safeAddress: ZERO_ADDRESS,
        values: [
          {
            nonce: 0,
            type: 'CONFLICT_HEADER',
          },
        ],
      }

      const newState = gatewayTransactionsReducer(EMPTY_STATE, addQueuedTransactions(testPayload))

      expect(newState).toEqual(EMPTY_STATE)
    })

    it('pushes `queued.queued` transactions with the same nonce', () => {
      const testPayload: QueuedPayload = {
        chainId: '4',
        safeAddress: ZERO_ADDRESS,
        values: [
          QUEUED_LABEL,
          {
            transaction: {
              id: 'svergvse5svt54se5v4',
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
              executionInfo: {
                nonce: 0,
                type: 'MULTISIG',
                confirmationsRequired: 2,
                confirmationsSubmitted: 2,
                missingSigners: null,
              },
            },
            conflictType: 'None',
            type: 'TRANSACTION',
          },
        ],
      }

      const prevState: GatewayTransactionsState = {
        4: {
          [ZERO_ADDRESS]: {
            queued: {
              next: {},
              queued: {
                0: [
                  {
                    id: 'srte54v45esw4v54vexdvfg',
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
                    executionInfo: {
                      nonce: 0,
                      type: 'MULTISIG',
                      confirmationsRequired: 2,
                      confirmationsSubmitted: 2,
                      missingSigners: null,
                    },
                  },
                ],
              },
            },
            history: {},
          },
        },
      }

      const expectedState: GatewayTransactionsState = {
        4: {
          [ZERO_ADDRESS]: {
            queued: {
              next: {},
              queued: {
                0: [
                  {
                    id: 'srte54v45esw4v54vexdvfg',
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
                    executionInfo: {
                      nonce: 0,
                      type: 'MULTISIG',
                      confirmationsRequired: 2,
                      confirmationsSubmitted: 2,
                      missingSigners: null,
                    },
                  },
                  // Pushed
                  {
                    id: 'svergvse5svt54se5v4',
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
                    executionInfo: {
                      nonce: 0,
                      type: 'MULTISIG',
                      confirmationsRequired: 2,
                      confirmationsSubmitted: 2,
                      missingSigners: null,
                    },
                  },
                ],
              },
            },
            history: {},
          },
        },
      }

      const newState = gatewayTransactionsReducer(prevState, addQueuedTransactions(testPayload))

      expect(newState).toEqual(expectedState)
    })
    it('adds `queued.queued` transactions to different nonce keys if the nonce differs between then', () => {
      const testPayload: QueuedPayload = {
        chainId: '4',
        safeAddress: ZERO_ADDRESS,
        values: [
          QUEUED_LABEL,
          {
            transaction: {
              id: 'hdr5dr5hdr5hreh',
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
              executionInfo: {
                nonce: 0,
                type: 'MULTISIG',
                confirmationsRequired: 2,
                confirmationsSubmitted: 2,
                missingSigners: null,
              },
            },
            conflictType: 'None',
            type: 'TRANSACTION',
          },
          {
            transaction: {
              id: 'dfgndfnnhdf6rn6t',
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
              executionInfo: {
                nonce: 1, // Diferent nonnce
                type: 'MULTISIG',
                confirmationsRequired: 2,
                confirmationsSubmitted: 2,
                missingSigners: null,
              },
            },
            conflictType: 'None',
            type: 'TRANSACTION',
          },
        ],
      }

      const expectedState: GatewayTransactionsState = {
        4: {
          [ZERO_ADDRESS]: {
            queued: {
              next: {},
              queued: {
                0: [
                  {
                    id: 'hdr5dr5hdr5hreh',
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
                    executionInfo: {
                      nonce: 0,
                      type: 'MULTISIG',
                      confirmationsRequired: 2,
                      confirmationsSubmitted: 2,
                      missingSigners: null,
                    },
                  },
                ],
                // Different nonce
                1: [
                  {
                    id: 'dfgndfnnhdf6rn6t',
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
                    executionInfo: {
                      nonce: 1,
                      type: 'MULTISIG',
                      confirmationsRequired: 2,
                      confirmationsSubmitted: 2,
                      missingSigners: null,
                    },
                  },
                ],
              },
            },
            history: {},
          },
        },
      }

      const newState = gatewayTransactionsReducer(EMPTY_STATE, addQueuedTransactions(testPayload))

      expect(newState).toEqual(expectedState)
    })

    it('merges existing `queued.queued` transactions', () => {
      const testPayload: QueuedPayload = {
        chainId: '4',
        safeAddress: ZERO_ADDRESS,
        values: [
          QUEUED_LABEL,
          {
            transaction: {
              id: 'sxdfhjfgtyyjkftuyfu6yucgyhjc',
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
              executionInfo: {
                nonce: 0,
                type: 'MULTISIG',
                confirmationsRequired: 2,
                confirmationsSubmitted: 2,
                missingSigners: null,
              },
            },
            conflictType: 'None',
            type: 'TRANSACTION',
          },
        ],
      }

      const prevState: GatewayTransactionsState = {
        4: {
          [ZERO_ADDRESS]: {
            queued: {
              next: {},
              queued: {
                0: [
                  {
                    id: 'sxdfhjfgtyyjkftuyfu6yucgyhjc',
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
                    executionInfo: {
                      nonce: 0,
                      type: 'MULTISIG',
                      confirmationsRequired: 2,
                      confirmationsSubmitted: 2,
                      missingSigners: null,
                    },
                    // Would have been added via `UPDATE_TRANSACTION_DETAILS`
                    txDetails: {
                      txId: 'sxdfhjfgtyyjkftuyfu6yucgyhjc',
                      executedAt: null,
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
                      txData: null,
                      detailedExecutionInfo: null,
                      txHash: null,
                      safeAppInfo: null,
                    },
                  },
                ],
              },
            },
            history: {},
          },
        },
      }

      const expectedState: GatewayTransactionsState = {
        4: {
          [ZERO_ADDRESS]: {
            queued: {
              next: {},
              queued: {
                0: [
                  {
                    id: 'sxdfhjfgtyyjkftuyfu6yucgyhjc',
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
                    executionInfo: {
                      nonce: 0,
                      type: 'MULTISIG',
                      confirmationsRequired: 2,
                      confirmationsSubmitted: 2,
                      missingSigners: null,
                    },
                    // Should keep `txDetails`
                    txDetails: {
                      txId: 'sxdfhjfgtyyjkftuyfu6yucgyhjc',
                      executedAt: null,
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
                      txData: null,
                      detailedExecutionInfo: null,
                      txHash: null,
                      safeAppInfo: null,
                    },
                  },
                ],
              },
            },
            history: {},
          },
        },
      }

      const newState = gatewayTransactionsReducer(prevState, addQueuedTransactions(testPayload))

      expect(newState).toEqual(expectedState)
    })

    it('merges existing `queued.next` transactions', () => {
      const testPayload: QueuedPayload = {
        chainId: '4',
        safeAddress: ZERO_ADDRESS,
        values: [
          NEXT_LABEL,
          {
            transaction: {
              id: 'sdfge4g4ges4sge4ge',
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
              executionInfo: {
                nonce: 0,
                type: 'MULTISIG',
                confirmationsRequired: 2,
                confirmationsSubmitted: 2,
                missingSigners: null,
              },
            },
            conflictType: 'None',
            type: 'TRANSACTION',
          },
        ],
      }

      const prevState: GatewayTransactionsState = {
        4: {
          [ZERO_ADDRESS]: {
            queued: {
              next: {
                0: [
                  {
                    id: 'sdfge4g4ges4sge4ge',
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
                    executionInfo: {
                      nonce: 0,
                      type: 'MULTISIG',
                      confirmationsRequired: 2,
                      confirmationsSubmitted: 2,
                      missingSigners: null,
                    },
                    // Would have been added via `UPDATE_TRANSACTION_DETAILS`
                    txDetails: {
                      txId: 'sdfge4g4ges4sge4ge',
                      executedAt: null,
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
                      txData: null,
                      detailedExecutionInfo: null,
                      txHash: null,
                      safeAppInfo: null,
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

      const expectedState: GatewayTransactionsState = {
        4: {
          [ZERO_ADDRESS]: {
            queued: {
              next: {
                0: [
                  {
                    id: 'sdfge4g4ges4sge4ge',
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
                    executionInfo: {
                      nonce: 0,
                      type: 'MULTISIG',
                      confirmationsRequired: 2,
                      confirmationsSubmitted: 2,
                      missingSigners: null,
                    },
                    // Should keep `txDetails`
                    txDetails: {
                      txId: 'sdfge4g4ges4sge4ge',
                      executedAt: null,
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
                      txData: null,
                      detailedExecutionInfo: null,
                      txHash: null,
                      safeAppInfo: null,
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

      const newState = gatewayTransactionsReducer(prevState, addQueuedTransactions(testPayload))

      expect(newState).toEqual(expectedState)
    })

    it('replaces `queued.queued` transactions if there are new confirmations', () => {
      const testPayload: QueuedPayload = {
        chainId: '4',
        safeAddress: ZERO_ADDRESS,
        values: [
          QUEUED_LABEL,
          {
            transaction: {
              id: 'gfjt6tr66ft6fjtgjyftyj',
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
              executionInfo: {
                nonce: 0,
                type: 'MULTISIG',
                confirmationsRequired: 2,
                confirmationsSubmitted: 2,
                missingSigners: null,
              },
            },
            conflictType: 'None',
            type: 'TRANSACTION',
          },
        ],
      }

      const prevState: GatewayTransactionsState = {
        4: {
          [ZERO_ADDRESS]: {
            queued: {
              next: {},
              queued: {
                0: [
                  {
                    id: 'gfjt6tr66ft6fjtgjyftyj',
                    timestamp: 0,
                    txStatus: TransactionStatus.AWAITING_CONFIRMATIONS,
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
                    executionInfo: {
                      nonce: 0,
                      type: 'MULTISIG',
                      confirmationsRequired: 2,
                      confirmationsSubmitted: 0,
                      missingSigners: null,
                    },
                    // Would have been added via `UPDATE_TRANSACTION_DETAILS`
                    txDetails: {
                      txId: 'gfjt6tr66ft6fjtgjyftyj',
                      executedAt: null,
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
                      txData: null,
                      detailedExecutionInfo: null,
                      txHash: null,
                      safeAppInfo: null,
                    },
                  },
                ],
              },
            },
            history: {},
          },
        },
      }

      const expectedState: GatewayTransactionsState = {
        4: {
          [ZERO_ADDRESS]: {
            queued: {
              next: {},
              queued: {
                0: [
                  {
                    id: 'gfjt6tr66ft6fjtgjyftyj',
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
                    executionInfo: {
                      nonce: 0,
                      type: 'MULTISIG',
                      confirmationsRequired: 2,
                      confirmationsSubmitted: 2,
                      missingSigners: null,
                    },
                    // Has removed `txDetails`
                  },
                ],
              },
            },
            history: {},
          },
        },
      }

      const newState = gatewayTransactionsReducer(prevState, addQueuedTransactions(testPayload))

      expect(newState).toEqual(expectedState)
    })
    it('replaces `queued.next` transactions if there are new confirmations', () => {
      const testPayload: QueuedPayload = {
        chainId: '4',
        safeAddress: ZERO_ADDRESS,
        values: [
          NEXT_LABEL,
          {
            transaction: {
              id: 'dvgry6u5uv67bifftyi7',
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
              executionInfo: {
                nonce: 0,
                type: 'MULTISIG',
                confirmationsRequired: 2,
                confirmationsSubmitted: 2,
                missingSigners: null,
              },
            },
            conflictType: 'None',
            type: 'TRANSACTION',
          },
        ],
      }

      const prevState: GatewayTransactionsState = {
        4: {
          [ZERO_ADDRESS]: {
            queued: {
              next: {
                0: [
                  {
                    id: 'dvgry6u5uv67bifftyi7',
                    timestamp: 0,
                    txStatus: TransactionStatus.AWAITING_CONFIRMATIONS,
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
                    executionInfo: {
                      nonce: 0,
                      type: 'MULTISIG',
                      confirmationsRequired: 2,
                      confirmationsSubmitted: 0,
                      missingSigners: null,
                    },
                    // Would have been added via `UPDATE_TRANSACTION_DETAILS`
                    txDetails: {
                      txId: 'dvgry6u5uv67bifftyi7',
                      executedAt: null,
                      txStatus: TransactionStatus.AWAITING_CONFIRMATIONS,
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

      const expectedState: GatewayTransactionsState = {
        4: {
          [ZERO_ADDRESS]: {
            queued: {
              next: {
                0: [
                  {
                    id: 'dvgry6u5uv67bifftyi7',
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
                    executionInfo: {
                      nonce: 0,
                      type: 'MULTISIG',
                      confirmationsRequired: 2,
                      confirmationsSubmitted: 2,
                      missingSigners: null,
                    },
                    // Has removed `txDetails`
                  },
                ],
              },
              queued: {},
            },
            history: {},
          },
        },
      }

      const newState = gatewayTransactionsReducer(prevState, addQueuedTransactions(testPayload))

      expect(newState).toEqual(expectedState)
    })
    it('resets the `queued.next` if there are no `queued` transactions at all', () => {
      const testPayload: QueuedPayload = {
        chainId: '4',
        safeAddress: ZERO_ADDRESS,
        values: [],
      }

      const prevState: GatewayTransactionsState = {
        4: {
          [ZERO_ADDRESS]: {
            queued: {
              next: {
                0: [
                  {
                    id: 'sv4tset4ves4tves4vtes4t',
                    timestamp: 0,
                    txStatus: TransactionStatus.AWAITING_CONFIRMATIONS,
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
                    executionInfo: {
                      nonce: 0,
                      type: 'MULTISIG',
                      confirmationsRequired: 2,
                      confirmationsSubmitted: 0,
                      missingSigners: null,
                    },
                    txDetails: {
                      txId: 'sv4tset4ves4tves4vtes4t',
                      executedAt: null,
                      txStatus: TransactionStatus.AWAITING_CONFIRMATIONS,
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

      const newState = gatewayTransactionsReducer(prevState, addQueuedTransactions(testPayload))

      expect(newState).toEqual(expectedState)
    })
  })
})
