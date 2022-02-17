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
    isCreation: false,
    isOffChainSignature: false,
    txEstimationExecutionStatus: EstimationStatus.SUCCESS,
  }

  it('renders ReviewInfoText with safeNonce in order', () => {
    render(<ReviewInfoText {...initialData} safeNonce="9" />)

    expect(screen.getByText(/You're about to execute a transaction/)).toBeInTheDocument()
  })

  it('renders ReviewInfoText with safeNonce in the future', () => {
    render(<ReviewInfoText {...initialData} safeNonce="11" />)

    expect(screen.getByText(/2/)).toBeInTheDocument()
    expect(screen.getByText(/transactions/)).toBeInTheDocument()
    expect(screen.getByText(/will need to be created and executed before this transaction/)).toBeInTheDocument()
  })

  it('renders ReviewInfoText with safeNonce in the future', () => {
    render(<ReviewInfoText {...initialData} safeNonce="6" />)

    expect(screen.getByText(/6/)).toBeInTheDocument()
    expect(screen.getByText(/9/)).toBeInTheDocument()
    expect(screen.getByText(/has already been used./)).toBeInTheDocument()
    expect(screen.getByText(/Your transaction will fail./)).toBeInTheDocument()
  })
})
