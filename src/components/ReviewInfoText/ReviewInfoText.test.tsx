import { EstimationStatus } from 'src/logic/hooks/useEstimateTransactionGas'
import { render, screen } from 'src/utils/test-utils'
import { ReviewInfoText } from './index'

jest.mock('src/logic/hooks/useRecommendedNonce', () => ({
  __esModule: true,
  default: () => 9,
}))

describe('<ReviewInfoText>', () => {
  const initialData = {
    gasCostFormatted: '0',
    isExecution: true,
    isCreation: true,
    isRejection: false,
    isOffChainSignature: false,
    txEstimationExecutionStatus: EstimationStatus.SUCCESS,
  }

  it('renders only base text with safeNonce in order', () => {
    render(<ReviewInfoText {...initialData} safeNonce="9" />)

    expect(screen.getByText(/You're about to create a transaction/)).toBeInTheDocument()
  })

  it('renders only base text with safeNonce in order and not a creation', () => {
    render(<ReviewInfoText {...initialData} safeNonce="9" isCreation={false} />)

    expect(screen.getByText(/You're about to execute a transaction/)).toBeInTheDocument()
  })

  it('renders only base text that is not a creation and nonce in future', () => {
    render(<ReviewInfoText {...initialData} safeNonce="100" isCreation={false} />)

    expect(screen.getByText(/You're about to execute a transaction/)).toBeInTheDocument()
    expect(screen.queryByText(/will need to be created and executed before this transaction/)).not.toBeInTheDocument()
  })

  it('renders only base text for a rejection tx with a nonce in the past', () => {
    render(<ReviewInfoText {...initialData} safeNonce="1" isRejection={true} />)

    expect(screen.getByText(/You're about to create a rejection transaction/)).toBeInTheDocument()
    expect(screen.queryByText(/will need to be created and executed before this transaction/)).not.toBeInTheDocument()
  })

  it('renders a warning with a safeNonce +1 tx in the future', () => {
    render(<ReviewInfoText {...initialData} safeNonce="10" />)

    expect(screen.getByText(/1/)).toBeInTheDocument()
    expect(
      screen.getByText(/transaction will need to be created and executed before this transaction/),
    ).toBeInTheDocument()
  })

  it('renders a warning with a safeNonce +2 txs the future', () => {
    render(<ReviewInfoText {...initialData} safeNonce="11" />)

    expect(screen.getByText(/2/)).toBeInTheDocument()
    expect(
      screen.getByText(/transactions will need to be created and executed before this transaction/),
    ).toBeInTheDocument()
  })

  it('renders a warning with an already used safeNonce', () => {
    render(<ReviewInfoText {...initialData} safeNonce="6" />)

    expect(screen.getByText(/6/)).toBeInTheDocument()
    expect(screen.getByText(/9/)).toBeInTheDocument()
    expect(screen.getByText(/is below the latest transaction's nonce in your queue./)).toBeInTheDocument()
    expect(screen.getByText(/Please verify the submitted nonce./)).toBeInTheDocument()
  })
})
