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
    isOffChainSignature: false,
    txEstimationExecutionStatus: EstimationStatus.SUCCESS,
  }

  it('renders ReviewInfoText with safeNonce in order', () => {
    render(<ReviewInfoText {...initialData} safeNonce="9" />)

    expect(screen.getByText(/You're about to create a transaction/)).toBeInTheDocument()
  })

  it('renders ReviewInfoText with safeNonce in order and not a creation', () => {
    render(<ReviewInfoText {...initialData} safeNonce="9" isCreation={false} />)

    expect(screen.getByText(/You're about to execute a transaction/)).toBeInTheDocument()
  })

  it('renders ReviewInfoText that is not a creation and nonce in future', () => {
    render(<ReviewInfoText {...initialData} safeNonce="100" isCreation={false} />)

    expect(screen.getByText(/You're about to execute a transaction/)).toBeInTheDocument()
    expect(screen.queryByText(/will need to be created and executed before this transaction/)).not.toBeInTheDocument()
  })

  it('renders ReviewInfoText with a safeNonce 1 tx in the future', () => {
    render(<ReviewInfoText {...initialData} safeNonce="10" />)

    expect(screen.getByText(/1/)).toBeInTheDocument()
    expect(
      screen.getByText(/transaction will need to be created and executed before this transaction/),
    ).toBeInTheDocument()
  })

  it('renders ReviewInfoText with a safeNonce 2 txs the future', () => {
    render(<ReviewInfoText {...initialData} safeNonce="11" />)

    expect(screen.getByText(/2/)).toBeInTheDocument()
    expect(
      screen.getByText(/transactions will need to be created and executed before this transaction/),
    ).toBeInTheDocument()
  })

  it('renders ReviewInfoText with already used safeNonce', () => {
    render(<ReviewInfoText {...initialData} safeNonce="6" />)

    expect(screen.getByText(/6/)).toBeInTheDocument()
    expect(screen.getByText(/9/)).toBeInTheDocument()
    expect(screen.getByText(/is below the latest transaction's nonce./)).toBeInTheDocument()
    expect(screen.getByText(/Your transaction might fail./)).toBeInTheDocument()
  })
})
