import { ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'
import { makeTxFromDetails } from '../utils'

describe('makeTxFromDetails', () => {
  it('returns a transaction made from a transaction details input', () => {
    const EXAMPLE_TRANSACTION_DETAILS = {
      txId: '123',
      executedAt: 123,
      txStatus: 'SUCCESS',
      txInfo: {
        type: 'Transfer',
        sender: {
          value: ZERO_ADDRESS,
          name: null,
          logoUri: null,
        },
        recipient: {
          value: ZERO_ADDRESS,
          name: null,
          logoUri: null,
        },
        direction: 'OUTGOING',
        transferInfo: {
          type: 'NATIVE_COIN',
          value: '123',
        },
      },
      txData: {
        hexData: null,
        dataDecoded: null,
        to: {
          value: ZERO_ADDRESS,
          name: null,
          logoUri: null,
        },
        value: null,
        operation: 0,
        addressInfoIndex: null,
      },
      txHash: '0x123',
      detailedExecutionInfo: {
        type: 'MULTISIG',
        submittedAt: 456,
        nonce: 123,
        safeTxGas: '123',
        baseGas: '123',
        gasPrice: '123',
        gasToken: '123',
        refundReceiver: {
          value: ZERO_ADDRESS,
          name: null,
          logoUri: null,
        },
        safeTxHash: '123',
        executor: null,
        signers: [
          {
            value: '0x1',
            name: null,
            logoUri: null,
          },
          {
            value: '0x2',
            name: null,
            logoUri: null,
          },
          {
            value: '0x3',
            name: null,
            logoUri: null,
          },
          {
            value: '0x4',
            name: null,
            logoUri: null,
          },
        ],
        confirmationsRequired: 123,
        confirmations: [
          {
            signer: {
              value: '0x1',
              name: null,
              logoUri: null,
            },
            signature: null,
            submittedAt: 123,
          },
          {
            signer: {
              value: '0x2',
              name: null,
              logoUri: null,
            },
            signature: null,
            submittedAt: 123,
          },
        ],
        rejectors: null,
        gasTokenInfo: null,
      },
      safeAppInfo: null,
    }

    const transaction = {
      id: EXAMPLE_TRANSACTION_DETAILS.txId,
      timestamp: EXAMPLE_TRANSACTION_DETAILS.executedAt,
      txStatus: EXAMPLE_TRANSACTION_DETAILS.txStatus,
      txInfo: EXAMPLE_TRANSACTION_DETAILS.txInfo,
      executionInfo: {
        type: EXAMPLE_TRANSACTION_DETAILS.detailedExecutionInfo.type,
        nonce: EXAMPLE_TRANSACTION_DETAILS.detailedExecutionInfo.nonce,
        confirmationsRequired: EXAMPLE_TRANSACTION_DETAILS.detailedExecutionInfo.confirmationsRequired,
        confirmationsSubmitted: 2,
        missingSigners: [
          {
            value: '0x3',
            name: null,
            logoUri: null,
          },
          {
            value: '0x4',
            name: null,
            logoUri: null,
          },
        ],
      },
      safeAppInfo: undefined,
      txDetails: EXAMPLE_TRANSACTION_DETAILS,
    }

    // @ts-ignore
    expect(makeTxFromDetails(EXAMPLE_TRANSACTION_DETAILS)).toEqual(transaction)
  })
  it('returns the executionInfo as is if the transaction details has module execution info', () => {
    const EXAMPLE_TRANSACTION_DETAILS = {
      txId: '123',
      executedAt: 123,
      txStatus: 'SUCCESS',
      txInfo: {
        type: 'Transfer',
        sender: {
          value: ZERO_ADDRESS,
          name: null,
          logoUri: null,
        },
        recipient: {
          value: ZERO_ADDRESS,
          name: null,
          logoUri: null,
        },
        direction: 'OUTGOING',
        transferInfo: {
          type: 'NATIVE_COIN',
          value: '123',
        },
      },
      txData: {
        hexData: null,
        dataDecoded: null,
        to: {
          value: ZERO_ADDRESS,
          name: null,
          logoUri: null,
        },
        value: null,
        operation: 0,
        addressInfoIndex: null,
      },
      txHash: '0x123',
      detailedExecutionInfo: {
        type: 'MODULE',
        submittedAt: 456,
        nonce: 123,
        safeTxGas: '123',
        baseGas: '123',
        gasPrice: '123',
        gasToken: '123',
        refundReceiver: {
          value: ZERO_ADDRESS,
          name: null,
          logoUri: null,
        },
        safeTxHash: '123',
        executor: null,
        signers: [
          {
            value: '0x1',
            name: null,
            logoUri: null,
          },
          {
            value: '0x2',
            name: null,
            logoUri: null,
          },
          {
            value: '0x3',
            name: null,
            logoUri: null,
          },
          {
            value: '0x4',
            name: null,
            logoUri: null,
          },
        ],
        confirmationsRequired: 123,
        confirmations: [
          {
            signer: {
              value: '0x1',
              name: null,
              logoUri: null,
            },
            signature: null,
            submittedAt: 123,
          },
          {
            signer: {
              value: '0x2',
              name: null,
              logoUri: null,
            },
            signature: null,
            submittedAt: 123,
          },
        ],
        rejectors: null,
        gasTokenInfo: null,
      },
      safeAppInfo: null,
    }

    // @ts-ignore
    expect(makeTxFromDetails(EXAMPLE_TRANSACTION_DETAILS).executionInfo).toEqual(
      EXAMPLE_TRANSACTION_DETAILS.detailedExecutionInfo,
    )
  })
  it('returns multisig formatted execution info if the details do not have module execution info', () => {
    const EXAMPLE_TRANSACTION_DETAILS = {
      txId: '123',
      executedAt: 123,
      txStatus: 'SUCCESS',
      txInfo: {
        type: 'Transfer',
        sender: {
          value: ZERO_ADDRESS,
          name: null,
          logoUri: null,
        },
        recipient: {
          value: ZERO_ADDRESS,
          name: null,
          logoUri: null,
        },
        direction: 'OUTGOING',
        transferInfo: {
          type: 'NATIVE_COIN',
          value: '123',
        },
      },
      txData: {
        hexData: null,
        dataDecoded: null,
        to: {
          value: ZERO_ADDRESS,
          name: null,
          logoUri: null,
        },
        value: null,
        operation: 0,
        addressInfoIndex: null,
      },
      txHash: '0x123',
      detailedExecutionInfo: {
        type: 'MULTISIG',
        submittedAt: 456,
        nonce: 123,
        safeTxGas: '123',
        baseGas: '123',
        gasPrice: '123',
        gasToken: '123',
        refundReceiver: {
          value: ZERO_ADDRESS,
          name: null,
          logoUri: null,
        },
        safeTxHash: '123',
        executor: null,
        signers: [
          {
            value: '0x1',
            name: null,
            logoUri: null,
          },
          {
            value: '0x2',
            name: null,
            logoUri: null,
          },
          {
            value: '0x3',
            name: null,
            logoUri: null,
          },
          {
            value: '0x4',
            name: null,
            logoUri: null,
          },
        ],
        confirmationsRequired: 123,
        confirmations: [
          {
            signer: {
              value: '0x1',
              name: null,
              logoUri: null,
            },
            signature: null,
            submittedAt: 123,
          },
          {
            signer: {
              value: '0x2',
              name: null,
              logoUri: null,
            },
            signature: null,
            submittedAt: 123,
          },
        ],
        rejectors: null,
        gasTokenInfo: null,
      },
      safeAppInfo: null,
    }

    const executionInfo = {
      type: EXAMPLE_TRANSACTION_DETAILS.detailedExecutionInfo.type,
      nonce: EXAMPLE_TRANSACTION_DETAILS.detailedExecutionInfo.nonce,
      confirmationsRequired: EXAMPLE_TRANSACTION_DETAILS.detailedExecutionInfo.confirmationsRequired,
      confirmationsSubmitted: 2,
      missingSigners: [
        {
          value: '0x3',
          name: null,
          logoUri: null,
        },
        {
          value: '0x4',
          name: null,
          logoUri: null,
        },
      ],
    }

    // @ts-ignore
    const transaction = makeTxFromDetails(EXAMPLE_TRANSACTION_DETAILS)

    //@ts-ignore
    expect(transaction.executionInfo.type).toEqual(executionInfo.type)
    //@ts-ignore
    expect(transaction.executionInfo.nonce).toEqual(executionInfo.nonce)
    //@ts-ignore
    expect(transaction.executionInfo.confirmationsRequired).toEqual(executionInfo.confirmationsRequired)
    //@ts-ignore
    expect(transaction.executionInfo.confirmationsSubmitted).toEqual(executionInfo.confirmationsSubmitted)
    //@ts-ignore
    expect(transaction.executionInfo.missingSigners).toEqual(executionInfo.missingSigners)
  })
  it('returns the correct number of missing signers', () => {
    const EXAMPLE_TRANSACTION_DETAILS = {
      txId: '123',
      executedAt: 123,
      txStatus: 'SUCCESS',
      txInfo: {
        type: 'Transfer',
        sender: {
          value: ZERO_ADDRESS,
          name: null,
          logoUri: null,
        },
        recipient: {
          value: ZERO_ADDRESS,
          name: null,
          logoUri: null,
        },
        direction: 'OUTGOING',
        transferInfo: {
          type: 'NATIVE_COIN',
          value: '123',
        },
      },
      txData: {
        hexData: null,
        dataDecoded: null,
        to: {
          value: ZERO_ADDRESS,
          name: null,
          logoUri: null,
        },
        value: null,
        operation: 0,
        addressInfoIndex: null,
      },
      txHash: '0x123',
      detailedExecutionInfo: {
        type: 'MULTISIG',
        submittedAt: 456,
        nonce: 123,
        safeTxGas: '123',
        baseGas: '123',
        gasPrice: '123',
        gasToken: '123',
        refundReceiver: {
          value: ZERO_ADDRESS,
          name: null,
          logoUri: null,
        },
        safeTxHash: '123',
        executor: null,
        signers: [
          {
            value: '0x1',
            name: null,
            logoUri: null,
          },
          {
            value: '0x2',
            name: null,
            logoUri: null,
          },
          {
            value: '0x3',
            name: null,
            logoUri: null,
          },
          {
            value: '0x4',
            name: null,
            logoUri: null,
          },
          {
            value: '0x5',
            name: null,
            logoUri: null,
          },
        ],
        confirmationsRequired: 123,
        confirmations: [
          {
            signer: {
              value: '0x1',
              name: null,
              logoUri: null,
            },
            signature: null,
            submittedAt: 123,
          },
          {
            signer: {
              value: '0x2',
              name: null,
              logoUri: null,
            },
            signature: null,
            submittedAt: 123,
          },
        ],
        rejectors: null,
        gasTokenInfo: null,
      },
      safeAppInfo: null,
    }

    // @ts-ignore
    const { missingSigners } = makeTxFromDetails(EXAMPLE_TRANSACTION_DETAILS).executionInfo

    expect(missingSigners).toEqual([
      {
        value: '0x3',
        name: null,
        logoUri: null,
      },
      {
        value: '0x4',
        name: null,
        logoUri: null,
      },
      {
        value: '0x5',
        name: null,
        logoUri: null,
      },
    ])
  })
  it('returns the submission timestamp for queued transactions', () => {
    const EXAMPLE_TRANSACTION_DETAILS = {
      txId: '123',
      executedAt: 123,
      txStatus: 'AWAITING_CONFIRMATIONS',
      txInfo: {
        type: 'Transfer',
        sender: {
          value: ZERO_ADDRESS,
          name: null,
          logoUri: null,
        },
        recipient: {
          value: ZERO_ADDRESS,
          name: null,
          logoUri: null,
        },
        direction: 'OUTGOING',
        transferInfo: {
          type: 'NATIVE_COIN',
          value: '123',
        },
      },
      txData: {
        hexData: null,
        dataDecoded: null,
        to: {
          value: ZERO_ADDRESS,
          name: null,
          logoUri: null,
        },
        value: null,
        operation: 0,
        addressInfoIndex: null,
      },
      txHash: '0x123',
      detailedExecutionInfo: {
        type: 'MULTISIG',
        submittedAt: 456,
        nonce: 123,
        safeTxGas: '123',
        baseGas: '123',
        gasPrice: '123',
        gasToken: '123',
        refundReceiver: {
          value: ZERO_ADDRESS,
          name: null,
          logoUri: null,
        },
        safeTxHash: '123',
        executor: null,
        signers: [
          {
            value: '0x1',
            name: null,
            logoUri: null,
          },
          {
            value: '0x2',
            name: null,
            logoUri: null,
          },
          {
            value: '0x3',
            name: null,
            logoUri: null,
          },
          {
            value: '0x4',
            name: null,
            logoUri: null,
          },
        ],
        confirmationsRequired: 123,
        confirmations: [
          {
            signer: {
              value: '0x1',
              name: null,
              logoUri: null,
            },
            signature: null,
            submittedAt: 123,
          },
          {
            signer: {
              value: '0x2',
              name: null,
              logoUri: null,
            },
            signature: null,
            submittedAt: 123,
          },
        ],
        rejectors: null,
        gasTokenInfo: null,
      },
      safeAppInfo: null,
    }

    // @ts-ignore
    expect(makeTxFromDetails(EXAMPLE_TRANSACTION_DETAILS).timestamp).toBe(456)
  })
  it('returns the execution timestamp for historical transactions', () => {
    const EXAMPLE_TRANSACTION_DETAILS = {
      txId: '123',
      executedAt: 123,
      txStatus: 'SUCCESS',
      txInfo: {
        type: 'Transfer',
        sender: {
          value: ZERO_ADDRESS,
          name: null,
          logoUri: null,
        },
        recipient: {
          value: ZERO_ADDRESS,
          name: null,
          logoUri: null,
        },
        direction: 'OUTGOING',
        transferInfo: {
          type: 'NATIVE_COIN',
          value: '123',
        },
      },
      txData: {
        hexData: null,
        dataDecoded: null,
        to: {
          value: ZERO_ADDRESS,
          name: null,
          logoUri: null,
        },
        value: null,
        operation: 0,
        addressInfoIndex: null,
      },
      txHash: '0x123',
      detailedExecutionInfo: {
        type: 'MULTISIG',
        submittedAt: 456,
        nonce: 123,
        safeTxGas: '123',
        baseGas: '123',
        gasPrice: '123',
        gasToken: '123',
        refundReceiver: {
          value: ZERO_ADDRESS,
          name: null,
          logoUri: null,
        },
        safeTxHash: '123',
        executor: null,
        signers: [
          {
            value: '0x1',
            name: null,
            logoUri: null,
          },
          {
            value: '0x2',
            name: null,
            logoUri: null,
          },
          {
            value: '0x3',
            name: null,
            logoUri: null,
          },
          {
            value: '0x4',
            name: null,
            logoUri: null,
          },
        ],
        confirmationsRequired: 123,
        confirmations: [
          {
            signer: {
              value: '0x1',
              name: null,
              logoUri: null,
            },
            signature: null,
            submittedAt: 123,
          },
          {
            signer: {
              value: '0x2',
              name: null,
              logoUri: null,
            },
            signature: null,
            submittedAt: 123,
          },
        ],
        rejectors: null,
        gasTokenInfo: null,
      },
      safeAppInfo: null,
    }

    // @ts-ignore
    expect(makeTxFromDetails(EXAMPLE_TRANSACTION_DETAILS).timestamp).toBe(123)
  })
})
