import { render, screen, act } from 'src/utils/test-utils'
import { EstimationStatus } from 'src/logic/hooks/useEstimateTransactionGas'
import { TransactionFailText, _ErrorMessage } from '.'

jest.mock('src/logic/wallets/store/selectors', () => {
  const original = jest.requireActual('src/logic/wallets/store/selectors')
  return {
    ...original,
    shouldSwitchWalletChain: () => false,
  }
})

jest.mock('src/routes/safe/container/selector', () => {
  const original = jest.requireActual('src/routes/safe/container/selector')
  return {
    ...original,
    grantedSelector: () => true,
  }
})

describe('TransactionFailText', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('shows the create & execute error', async () => {
    await act(async () => {
      render(<TransactionFailText isExecution isCreation estimationStatus={EstimationStatus.FAILURE} />)
    })

    expect(screen.getByAltText('Info Tooltip')).toBeDefined()
    expect(screen.getByText(`${_ErrorMessage.general} ${_ErrorMessage.creation}`)).toBeDefined()
  })

  it('shows the execution error when execution an existing tx', async () => {
    await act(async () => {
      render(<TransactionFailText isExecution isCreation={false} estimationStatus={EstimationStatus.FAILURE} />)
    })

    expect(screen.getByAltText('Info Tooltip')).toBeDefined()
    expect(screen.getByText(`${_ErrorMessage.general} ${_ErrorMessage.execution}`)).toBeDefined()
  })

  it('shows a wrong chain error', async () => {
    const sel = require('src/logic/wallets/store/selectors')
    ;(sel.shouldSwitchWalletChain as jest.Mocked<unknown>) = jest.fn(() => true)

    await act(async () => {
      render(<TransactionFailText isExecution isCreation={false} estimationStatus={EstimationStatus.FAILURE} />)
    })

    expect(screen.getByAltText('Info Tooltip')).toBeDefined()
    expect(screen.getByText(_ErrorMessage.wrongChain)).toBeDefined()
  })

  it('shows an owner error', async () => {
    const sel = require('src/routes/safe/container/selector')
    ;(sel.grantedSelector as jest.Mocked<unknown>) = jest.fn(() => false)

    await act(async () => {
      render(<TransactionFailText isExecution isCreation estimationStatus={EstimationStatus.FAILURE} />)
    })

    expect(screen.getByAltText('Info Tooltip')).toBeDefined()
    expect(screen.getByText(_ErrorMessage.notOwner)).toBeDefined()
  })

  it('renders null if neither execution nor creation error', async () => {
    await act(async () => {
      render(<TransactionFailText isExecution={false} isCreation={false} estimationStatus={EstimationStatus.FAILURE} />)
    })

    expect(() => screen.getByAltText('Info Tooltip')).toThrow()
  })

  it('renders null if estimation status is not failure', async () => {
    await act(async () => {
      render(<TransactionFailText isExecution isCreation={false} estimationStatus={EstimationStatus.LOADING} />)
    })

    expect(() => screen.getByAltText('Info Tooltip')).toThrow()
  })
})
