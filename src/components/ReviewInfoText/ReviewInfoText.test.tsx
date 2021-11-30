import { useSelector } from 'react-redux'
import { EstimationStatus } from 'src/logic/hooks/useEstimateTransactionGas'
import { render, screen } from 'src/utils/test-utils'
import { ReviewInfoText } from './index'
import { history } from 'src/routes/routes'

const safeAddress = '0xC245cb45B044d66fbE8Fb33C26c0b28B4fc367B2'
const url = `/rin:${safeAddress}/settings/advanced`
history.location.pathname = url

describe('<ReviewInfoText>', () => {
  const initialData = {
    gasCostFormatted: '0',
    isExecution: true,
    isCreation: false,
    isOffChainSignature: false,
    txEstimationExecutionStatus: EstimationStatus.SUCCESS,
  }
  const customState = {
    safes: {
      safes: {
        [safeAddress]: {
          address: safeAddress,
          nonce: 8,
          modules: null,
          guard: '',
          currentVersion: '1.3.0',
        },
      },
    },
  }
  const testId = 'reviewInfoText-component'
  const warningCommonCopy =
    'will need to be created and executed before this transaction, are you sure you want to do this?'

  it('Renders ReviewInfoText with safeNonce being one lastTxNonce + 1', () => {
    const lastTxNonce = 10
    const safeNonce = `${lastTxNonce + 1}`

    render(<ReviewInfoText {...initialData} safeNonce={safeNonce} testId={testId} />, customState)

    expect(screen.getByTestId(testId)).toBeInTheDocument()
    expect(screen.queryByText(warningCommonCopy)).not.toBeInTheDocument()
  })

  it('Renders ReviewInfoText with safeNonce more than one transaction ahead of lastTxNonce', () => {
    const lastTxNonce = 10
    const safeNonce = `${lastTxNonce + 4}`
    const expectedCopy = 'transactions ' + warningCommonCopy

    render(<ReviewInfoText {...initialData} safeNonce={safeNonce} testId={testId} />, customState)

    expect(screen.getByTestId(testId)).toBeInTheDocument()
    expect(screen.getByText('6')).toBeInTheDocument()
    expect(screen.queryByText(expectedCopy)).toBeInTheDocument()
  })
})
