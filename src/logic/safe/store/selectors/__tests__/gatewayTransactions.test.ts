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
  it('returns an empty array if there is no next transaction', () => {
    const result = getBatchableTransactions.resultFunc(undefined, undefined, 1)
    expect(result).toHaveLength(0)
  })

  it('returns an empty array if nonce of next transaction is out-of-order', () => {
    const mockTx = {
      ...defaultNextTx,
      executionInfo: {
        ...defaultNextTx.executionInfo,
        nonce: 2,
      } as MultisigExecutionInfo,
    }

    const result = getBatchableTransactions.resultFunc(mockTx, undefined, 1)
    expect(result).toHaveLength(0)
  })

  it('returns an empty array if next transaction doesnt have enough confirmations', () => {
    const mockTx = {
      ...defaultNextTx,
      executionInfo: {
        ...defaultNextTx.executionInfo,
        confirmationsRequired: 2,
        confirmationsSubmitted: 1,
      } as MultisigExecutionInfo,
    }

    const result = getBatchableTransactions.resultFunc(mockTx, undefined, 1)
    expect(result).toHaveLength(0)
  })

  it('returns next transaction if it is eligible', () => {
    const mockTx = {
      ...defaultNextTx,
      executionInfo: {
        ...defaultNextTx.executionInfo,
        nonce: 1,
        confirmationsRequired: 2,
        confirmationsSubmitted: 2,
      } as MultisigExecutionInfo,
    }

    const result = getBatchableTransactions.resultFunc(mockTx, undefined, 1)
    expect(result).toHaveLength(1)
  })

  it('adds queued transaction to the result if it is eligible', () => {
    const mockTx = {
      ...defaultNextTx,
      executionInfo: {
        ...defaultNextTx.executionInfo,
        nonce: 1,
        confirmationsRequired: 2,
        confirmationsSubmitted: 2,
      } as MultisigExecutionInfo,
    }

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
  })

  it('adds queued transaction to the result even if there is a reject tx for the same nonce', () => {
    const mockTx = {
      ...defaultNextTx,
      executionInfo: {
        ...defaultNextTx.executionInfo,
        nonce: 1,
        confirmationsRequired: 2,
        confirmationsSubmitted: 2,
      } as MultisigExecutionInfo,
    }

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
        confirmationsSubmitted: 2,
      } as MultisigExecutionInfo,
    }

    const mockQueueTxs = { 2: [mockQueueTx, mockRejectTx] }

    const result = getBatchableTransactions.resultFunc(mockTx, mockQueueTxs, 1)
    expect(result).toHaveLength(2)
    expect(result).not.toContain(mockRejectTx.txInfo.isCancellation)
  })

  it('doesnt add a queued transaction if there is one before that is missing confirmations', () => {
    const mockTx = {
      ...defaultNextTx,
      executionInfo: {
        ...defaultNextTx.executionInfo,
        nonce: 1,
        confirmationsRequired: 2,
        confirmationsSubmitted: 2,
      } as MultisigExecutionInfo,
    }

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
