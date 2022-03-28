import {
  TransactionStatus,
  TransactionTokenType,
  TransferDirection,
  TransferInfo,
  TransactionInfo,
  MultisigExecutionInfo,
  Custom,
} from '@gnosis.pm/safe-react-gateway-sdk'

import { Transaction } from 'src/logic/safe/store/models/types/gateway'
import { getBatchableTransactions } from 'src/logic/safe/store/selectors/gatewayTransactions'

const mockAddressEx = {
  value: 'string',
  name: null,
  logoUri: null,
}

const mockTransferInfo: TransferInfo = {
  type: TransactionTokenType.ERC20,
  tokenAddress: 'string',
  tokenName: null,
  tokenSymbol: null,
  logoUri: null,
  decimals: null,
  value: 'string',
}

const mockTxInfo: TransactionInfo = {
  type: 'Transfer',
  sender: mockAddressEx,
  recipient: mockAddressEx,
  direction: TransferDirection.OUTGOING,
  transferInfo: mockTransferInfo,
}

const defaultNextTx: Transaction = {
  id: '',
  timestamp: 0,
  txInfo: mockTxInfo,
  txStatus: TransactionStatus.AWAITING_CONFIRMATIONS,
  executionInfo: {
    type: 'MULTISIG',
    nonce: 1,
    confirmationsRequired: 2,
    confirmationsSubmitted: 1,
    missingSigners: null,
  } as MultisigExecutionInfo,
}

describe('getBatchableTransactions', () => {
  it('returns an empty array if there is no next tx', () => {
    const result = getBatchableTransactions.resultFunc(undefined, undefined, 1)
    expect(result).toHaveLength(0)
  })

  it('returns an empty array if nonce of next tx is out-of-order', () => {
    const mockTx = [
      {
        ...defaultNextTx,
        executionInfo: {
          ...defaultNextTx.executionInfo,
          nonce: 2,
        } as MultisigExecutionInfo,
      },
    ]

    const result = getBatchableTransactions.resultFunc(mockTx, undefined, 1)
    expect(result).toHaveLength(0)
  })

  it('returns an empty array if next tx doesnt have enough confirmations', () => {
    const mockTx = [
      {
        ...defaultNextTx,
        executionInfo: {
          ...defaultNextTx.executionInfo,
          confirmationsRequired: 2,
          confirmationsSubmitted: 1,
        } as MultisigExecutionInfo,
      },
    ]

    const result = getBatchableTransactions.resultFunc(mockTx, undefined, 1)
    expect(result).toHaveLength(0)
  })

  it('returns next tx if it is eligible', () => {
    const mockTx = [
      {
        ...defaultNextTx,
        executionInfo: {
          ...defaultNextTx.executionInfo,
          nonce: 1,
          confirmationsRequired: 2,
          confirmationsSubmitted: 2,
        } as MultisigExecutionInfo,
      },
    ]

    const result = getBatchableTransactions.resultFunc(mockTx, undefined, 1)
    expect(result).toHaveLength(1)
  })

  it('chooses the first eligible transaction in group', () => {
    const mockNextTx = {
      ...defaultNextTx,
      executionInfo: {
        ...defaultNextTx.executionInfo,
        nonce: 1,
        confirmationsRequired: 2,
        confirmationsSubmitted: 2,
      } as MultisigExecutionInfo,
    }

    const mockRejectTx = {
      ...defaultNextTx,
      txInfo: {
        ...mockTxInfo,
        type: 'Custom',
        isCancellation: true,
      } as unknown as Custom,
      executionInfo: {
        ...defaultNextTx.executionInfo,
        nonce: 1,
        confirmationsRequired: 2,
        confirmationsSubmitted: 1,
      } as MultisigExecutionInfo,
    }

    const mockNextTx1 = {
      ...defaultNextTx,
      executionInfo: {
        ...defaultNextTx.executionInfo,
        nonce: 1,
        confirmationsRequired: 2,
        confirmationsSubmitted: 2,
      } as MultisigExecutionInfo,
    }

    const mockTx = [mockRejectTx, mockNextTx1, mockNextTx]

    const result = getBatchableTransactions.resultFunc(mockTx, undefined, 1)
    expect(result).toHaveLength(1)
    expect(result).toContain(mockNextTx1)
  })

  it('chooses next tx if reject tx is not eligible', () => {
    const mockNextTx = {
      ...defaultNextTx,
      executionInfo: {
        ...defaultNextTx.executionInfo,
        nonce: 1,
        confirmationsRequired: 2,
        confirmationsSubmitted: 2,
      } as MultisigExecutionInfo,
    }

    const mockRejectTx = {
      ...defaultNextTx,
      txInfo: {
        ...mockTxInfo,
        type: 'Custom',
        isCancellation: true,
      } as unknown as Custom,
      executionInfo: {
        ...defaultNextTx.executionInfo,
        nonce: 1,
        confirmationsRequired: 2,
        confirmationsSubmitted: 1,
      } as MultisigExecutionInfo,
    }

    const mockTx = [mockNextTx, mockRejectTx]

    const result = getBatchableTransactions.resultFunc(mockTx, undefined, 1)
    expect(result).toHaveLength(1)
    expect(result).toContain(mockNextTx)
  })

  it('adds queued tx to the result if it is eligible', () => {
    const mockTx = [
      {
        ...defaultNextTx,
        executionInfo: {
          ...defaultNextTx.executionInfo,
          nonce: 1,
          confirmationsRequired: 2,
          confirmationsSubmitted: 2,
        } as MultisigExecutionInfo,
      },
    ]

    const mockQueueTx = {
      ...defaultNextTx,
      executionInfo: {
        ...defaultNextTx.executionInfo,
        nonce: 2,
        confirmationsRequired: 2,
        confirmationsSubmitted: 2,
      } as MultisigExecutionInfo,
    }

    const mockQueueTxs = { 2: [mockQueueTx] }

    const result = getBatchableTransactions.resultFunc(mockTx, mockQueueTxs, 1)
    expect(result).toHaveLength(2)
    expect(result).toContain(mockQueueTx)
  })

  it('chooses first eligible tx in queued group', () => {
    const mockTx = [
      {
        ...defaultNextTx,
        executionInfo: {
          ...defaultNextTx.executionInfo,
          nonce: 1,
          confirmationsRequired: 2,
          confirmationsSubmitted: 2,
        } as MultisigExecutionInfo,
      },
    ]

    const mockQueueTx = {
      ...defaultNextTx,
      executionInfo: {
        ...defaultNextTx.executionInfo,
        nonce: 2,
        confirmationsRequired: 2,
        confirmationsSubmitted: 1,
      } as MultisigExecutionInfo,
    }

    const mockQueueTx1 = {
      ...defaultNextTx,
      executionInfo: {
        ...defaultNextTx.executionInfo,
        nonce: 2,
        confirmationsRequired: 2,
        confirmationsSubmitted: 1,
      } as MultisigExecutionInfo,
    }

    const mockRejectTx = {
      ...defaultNextTx,
      txInfo: {
        ...mockTxInfo,
        type: 'Custom',
        isCancellation: true,
      } as unknown as Custom,
      executionInfo: {
        ...defaultNextTx.executionInfo,
        nonce: 2,
        confirmationsRequired: 2,
        confirmationsSubmitted: 2,
      } as MultisigExecutionInfo,
    }

    const mockQueueTxs = { 2: [mockQueueTx1, mockQueueTx, mockRejectTx] }

    const result = getBatchableTransactions.resultFunc(mockTx, mockQueueTxs, 1)
    expect(result).toHaveLength(2)
    expect(result).toContain(mockRejectTx)
  })

  it('chooses queued tx if reject tx is not eligible', () => {
    const mockTx = [
      {
        ...defaultNextTx,
        executionInfo: {
          ...defaultNextTx.executionInfo,
          nonce: 1,
          confirmationsRequired: 2,
          confirmationsSubmitted: 2,
        } as MultisigExecutionInfo,
      },
    ]

    const mockQueueTx = {
      ...defaultNextTx,
      executionInfo: {
        ...defaultNextTx.executionInfo,
        nonce: 2,
        confirmationsRequired: 2,
        confirmationsSubmitted: 2,
      } as MultisigExecutionInfo,
    }

    const mockRejectTx = {
      ...defaultNextTx,
      txInfo: {
        ...mockTxInfo,
        type: 'Custom',
        isCancellation: true,
      } as unknown as Custom,
      executionInfo: {
        ...defaultNextTx.executionInfo,
        nonce: 2,
        confirmationsRequired: 2,
        confirmationsSubmitted: 1,
      } as MultisigExecutionInfo,
    }

    const mockQueueTxs = { 2: [mockQueueTx, mockRejectTx] }

    const result = getBatchableTransactions.resultFunc(mockTx, mockQueueTxs, 1)
    expect(result).toHaveLength(2)
    expect(result).toContain(mockQueueTx)
  })

  it('doesnt add a queued tx if there is one before that is missing confirmations', () => {
    const mockTx = [
      {
        ...defaultNextTx,
        executionInfo: {
          ...defaultNextTx.executionInfo,
          nonce: 1,
          confirmationsRequired: 2,
          confirmationsSubmitted: 2,
        } as MultisigExecutionInfo,
      },
    ]

    const mockQueueTx1 = {
      ...defaultNextTx,
      executionInfo: {
        ...defaultNextTx.executionInfo,
        nonce: 2,
        confirmationsRequired: 2,
        confirmationsSubmitted: 2,
      } as MultisigExecutionInfo,
    }

    const mockQueueTx2 = {
      ...defaultNextTx,
      executionInfo: {
        ...defaultNextTx.executionInfo,
        nonce: 3,
        confirmationsRequired: 2,
        confirmationsSubmitted: 1,
      } as MultisigExecutionInfo,
    }

    const mockQueueTx3 = {
      ...defaultNextTx,
      executionInfo: {
        ...defaultNextTx.executionInfo,
        nonce: 4,
        confirmationsRequired: 2,
        confirmationsSubmitted: 2,
      } as MultisigExecutionInfo,
    }

    const mockQueueTxs = { 2: [mockQueueTx1], 3: [mockQueueTx2], 4: [mockQueueTx3] }

    const result = getBatchableTransactions.resultFunc(mockTx, mockQueueTxs, 1)
    expect(result).toHaveLength(2)
  })
})
