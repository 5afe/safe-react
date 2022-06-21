import { render, fireEvent, screen } from 'src/utils/test-utils'
import QueueBar from './QueueBar'
import { CHAIN_ID } from 'src/config/chain.d'
import { CURRENT_SESSION_REDUCER_ID } from 'src/logic/currentSession/store/reducer/currentSession'

const safeAddress = '0x57CB13cbef735FbDD65f5f2866638c546464E45F'
const ownerAddress = '0x680cde08860141F9D223cE4E620B10Cd6741037E'
const pendingOwnerAddress = '0x6B93e189650eEa58186161bB80F786E0dF86aF16'
const currentNonce = 144
const pendingTransaction = {
  id: 'transactionId',
  timestamp: 1655715287703,
  txStatus: 'AWAITING_CONFIRMATIONS',
  txInfo: {
    type: 'Transfer',
    sender: {
      value: safeAddress,
    },
    recipient: {
      value: ownerAddress,
    },
    direction: 'OUTGOING',
    transferInfo: {
      type: 'NATIVE_COIN',
      value: '1000000000000000',
    },
  },
  executionInfo: {
    type: 'MULTISIG',
    nonce: currentNonce,
    confirmationsRequired: 2,
    confirmationsSubmitted: 1,
    missingSigners: [
      {
        value: pendingOwnerAddress,
      },
    ],
  },
  txDetails: {
    safeAddress: safeAddress,
    txId: 'transactionId',
    executedAt: null,
    txStatus: 'AWAITING_CONFIRMATIONS',
    txInfo: {
      type: 'Transfer',
      sender: {
        value: safeAddress,
      },
      recipient: {
        value: ownerAddress,
      },
      direction: 'OUTGOING',
      transferInfo: {
        type: 'NATIVE_COIN',
        value: '1000000000000000',
      },
    },
    txData: {
      hexData: null,
      dataDecoded: null,
      to: {
        value: ownerAddress,
      },
      value: '1000000000000000',
      operation: 0,
    },
    detailedExecutionInfo: {
      type: 'MULTISIG',
      submittedAt: 1655715287703,
      nonce: 144,
      safeTxGas: '0',
      baseGas: '0',
      gasPrice: '0',
      gasToken: '0x0000000000000000000000000000000000000000',
      refundReceiver: {
        value: '0x0000000000000000000000000000000000000000',
      },
      safeTxHash: '0x6f5a8ed0603234cea0975f70d3b6e9dce97aa25b8ae88c6b305d7b654307cc51',
      executor: null,
      signers: [
        {
          value: pendingOwnerAddress,
        },
        {
          value: ownerAddress,
        },
      ],
      confirmationsRequired: 2,
      confirmations: [
        {
          signer: {
            value: ownerAddress,
          },
          signature:
            '0x0c3290fab2edcddd794539476c6dcbcecd3835e48b2365b5f74bfcb8aadc5d7a3ffc24aefc27da4981f0beff63767e9890bff448dd2427950a8d8e4e618e404e1c',
          submittedAt: 1655715287734,
        },
      ],
    },
    txHash: null,
  },
}

describe('<QueueBar>', () => {
  it('Renders the QueueBar bar', () => {
    const customState = {
      providers: {
        name: 'MetaMask',
        loaded: true,
        available: true,
        account: ownerAddress,
        network: '4',
      },
      [CURRENT_SESSION_REDUCER_ID]: {
        currentSafeAddress: safeAddress,
      },
      gatewayTransactions: {
        [CHAIN_ID.RINKEBY]: {
          [safeAddress]: {
            queued: {
              next: {
                [currentNonce]: [pendingTransaction],
              },
              queued: {},
            },
          },
        },
      },
    }

    const setClosedBarSpy = jest.fn()

    render(<QueueBar showQueueBar setClosedBar={setClosedBarSpy} />, customState)

    const queueNode = screen.getByTestId('pending-transactions-queue')

    expect(queueNode).toBeInTheDocument()

    expect(screen.getByText('(1) Queue')).toBeInTheDocument()

    // shows pending transaction preview info
    expect(screen.getByText(currentNonce)).toBeInTheDocument()
    expect(screen.getByText('Needs confirmations')).toBeInTheDocument()
  })

  it('Closes the QueueBar bar', () => {
    const customState = {
      providers: {
        name: 'MetaMask',
        loaded: true,
        available: true,
        account: ownerAddress,
        network: '4',
      },
      [CURRENT_SESSION_REDUCER_ID]: {
        currentSafeAddress: safeAddress,
      },
      gatewayTransactions: {
        [CHAIN_ID.RINKEBY]: {
          [safeAddress]: {
            queued: {
              next: {
                [currentNonce]: [pendingTransaction],
              },
              queued: {},
            },
          },
        },
      },
    }

    const setClosedBarSpy = jest.fn()

    render(<QueueBar showQueueBar setClosedBar={setClosedBarSpy} />, customState)

    const closeQueueButtonNode = screen.getByLabelText('close pending transactions queue')

    expect(closeQueueButtonNode).toBeInTheDocument()

    // we open the Queue if it was closed
    expect(setClosedBarSpy).toHaveBeenCalledWith(false)
    expect(setClosedBarSpy).not.toHaveBeenCalledWith(true)

    fireEvent.click(closeQueueButtonNode)

    expect(setClosedBarSpy).toHaveBeenCalledWith(true)
  })

  it('Collapses the QueueBar bar', () => {
    const customState = {
      providers: {
        name: 'MetaMask',
        loaded: true,
        available: true,
        account: ownerAddress,
        network: '4',
      },
      [CURRENT_SESSION_REDUCER_ID]: {
        currentSafeAddress: safeAddress,
      },
      gatewayTransactions: {
        [CHAIN_ID.RINKEBY]: {
          [safeAddress]: {
            queued: {
              next: {
                [currentNonce]: [pendingTransaction],
              },
              queued: {},
            },
          },
        },
      },
    }
    const setClosedBarSpy = jest.fn()

    render(<QueueBar showQueueBar setClosedBar={setClosedBarSpy} />, customState)

    const queueNode = screen.getByTestId('pending-transactions-queue-summary')

    expect(queueNode).toBeInTheDocument()

    expect(queueNode).toHaveAttribute('aria-expanded', 'false')

    // collapses the queue
    fireEvent.click(screen.getByText('(1) Queue'))

    expect(queueNode).toHaveAttribute('aria-expanded', 'true')
  })

  it('Hides the QueueBar bar', () => {
    render(<QueueBar showQueueBar={false} setClosedBar={jest.fn()} />)

    const queueNode = screen.queryByTestId('pending-transactions-queue')

    expect(queueNode).not.toBeInTheDocument()

    expect(screen.queryByText('Queue')).not.toBeInTheDocument()
  })
})
