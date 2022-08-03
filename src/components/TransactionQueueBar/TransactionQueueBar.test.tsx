import { render, fireEvent, screen } from 'src/utils/test-utils'
import TransactionQueueBar from './TransactionQueueBar'
import { CHAIN_ID } from 'src/config/chain.d'
import { CURRENT_SESSION_REDUCER_ID } from 'src/logic/currentSession/store/reducer/currentSession'
import { generateSafeRoute, history, SAFE_ROUTES } from 'src/routes/routes'

const MULTISEND_ADDRESS = '0x4242424242424242424242424242424242424242'
jest.mock('src/logic/contracts/safeContracts', () => ({
  ...jest.requireActual('src/logic/contracts/safeContracts'),
  getMultiSendCallOnlyContractAddress: () => MULTISEND_ADDRESS,
}))

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

describe('<TransactionQueueBar>', () => {
  afterEach(() => {
    history.push('/')
  })

  it('Renders the TransactionQueueBar bar within a Safe App', () => {
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

    const safeAppUrl = generateSafeRoute(SAFE_ROUTES.APPS, { safeAddress, shortName: 'rin' })
    const safeAppPathname = `${safeAppUrl}?appUrl=https://apps.gnosis-safe.io/tx-builder`

    history.push(safeAppPathname)

    render(<TransactionQueueBar />, customState)

    const queueBarNode = screen.getByTestId('transaction-queue-bar')

    expect(queueBarNode).toBeInTheDocument()

    expect(screen.getByText('(1) Transaction Queue')).toBeInTheDocument()

    // collapsed by default
    const queueBarSummaryNode = screen.getByTestId('transaction-queue-bar-summary')
    expect(queueBarSummaryNode).toHaveAttribute('aria-expanded', 'false')
  })

  it('Hides the TransactionQueueBar bar outside of a Safe App', () => {
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

    history.push('/')

    render(<TransactionQueueBar />, customState)

    const queueBarNode = screen.queryByTestId('transaction-queue-bar')

    expect(queueBarNode).not.toBeInTheDocument()
  })

  it('Closes the TransactionQueueBar component', () => {
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

    const safeAppUrl = generateSafeRoute(SAFE_ROUTES.APPS, { safeAddress, shortName: 'rin' })
    const safeAppPathname = `${safeAppUrl}?appUrl=https://apps.gnosis-safe.io/tx-builder`

    history.push(safeAppPathname)

    render(<TransactionQueueBar />, customState)

    const queueBarNode = screen.getByTestId('transaction-queue-bar')

    expect(queueBarNode).toBeInTheDocument()

    const closeQueueBarButtonNode = screen.getByLabelText('close transaction queue bar')

    expect(closeQueueBarButtonNode).toBeInTheDocument()

    fireEvent.click(closeQueueBarButtonNode)

    expect(closeQueueBarButtonNode).not.toBeInTheDocument()
    expect(queueBarNode).not.toBeInTheDocument()
  })

  it('Collapses the TransactionQueueBar bar', () => {
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

    const safeAppUrl = generateSafeRoute(SAFE_ROUTES.APPS, { safeAddress, shortName: 'rin' })
    const safeAppPathname = `${safeAppUrl}?appUrl=https://apps.gnosis-safe.io/tx-builder`

    history.push(safeAppPathname)

    render(<TransactionQueueBar />, customState)

    const queueBarNode = screen.getByTestId('transaction-queue-bar-summary')

    expect(queueBarNode).toBeInTheDocument()

    expect(queueBarNode).toHaveAttribute('aria-expanded', 'false')

    // collapses the queue
    fireEvent.click(screen.getByText('(1) Transaction Queue'))

    expect(queueBarNode).toHaveAttribute('aria-expanded', 'true')

    // shows pending transaction preview info
    expect(screen.getByText(currentNonce)).toBeInTheDocument()
    expect(screen.getByText('Needs confirmations')).toBeInTheDocument()
  })
})
