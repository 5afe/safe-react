import {
  calculateTotalGasCost,
  EstimationStatus,
  getDefaultGasEstimation,
  useEstimateTransactionGas,
} from 'src/logic/hooks/useEstimateTransactionGas'
import { renderHook } from '@testing-library/react-hooks'
import { DEFAULT_MAX_GAS_FEE, DEFAULT_MAX_PRIO_FEE } from 'src/logic/wallets/ethTransactions'
import { fromWei } from 'web3-utils'
import * as ethTransactions from 'src/logic/wallets/ethTransactions'
import * as gas from 'src/logic/safe/transactions/gas'
import { waitFor } from 'src/utils/test-utils'

jest.mock('react-redux', () => {
  const original = jest.requireActual('react-redux')
  return {
    ...original,
    useSelector: jest.fn,
  }
})

describe('useEstimateTransactionGas', () => {
  let mockParams
  let initialState
  let failureState

  beforeAll(() => {
    mockParams = {
      txData: '',
      txRecipient: '',
      txAmount: '',
      safeTxGas: '',
      operation: 1,
      isExecution: false,
      approvalAndExecution: false,
    }
    initialState = getDefaultGasEstimation({
      txEstimationExecutionStatus: EstimationStatus.LOADING,
      gasPrice: '0',
      gasPriceFormatted: '0',
      gasMaxPrioFee: '0',
      gasMaxPrioFeeFormatted: '0',
    })
    failureState = getDefaultGasEstimation({
      txEstimationExecutionStatus: EstimationStatus.FAILURE,
      gasPrice: DEFAULT_MAX_GAS_FEE.toString(),
      gasPriceFormatted: fromWei(DEFAULT_MAX_GAS_FEE.toString(), 'gwei'),
      gasMaxPrioFee: DEFAULT_MAX_PRIO_FEE.toString(),
      gasMaxPrioFeeFormatted: fromWei(DEFAULT_MAX_PRIO_FEE.toString(), 'gwei'),
    })
  })
  it('returns initial estimation and successful loading state if tx is not execution', () => {
    const { result } = renderHook(() => useEstimateTransactionGas(mockParams))

    expect(result.current).toStrictEqual({ ...initialState, txEstimationExecutionStatus: EstimationStatus.SUCCESS })
  })

  it('returns initial estimation and successful loading state if there is no txData', () => {
    const { result } = renderHook(() => useEstimateTransactionGas({ ...mockParams, isExecution: true }))

    expect(result.current).toStrictEqual({ ...initialState, txEstimationExecutionStatus: EstimationStatus.SUCCESS })
  })

  it('estimates gas price, max priority fee and gas limit', async () => {
    const gasPriceEstimationSpy = jest.spyOn(ethTransactions, 'calculateGasPrice').mockImplementation(jest.fn())
    const prioFeeEstimationSpy = jest.spyOn(ethTransactions, 'getFeesPerGas').mockImplementation(() => {
      return Promise.resolve({
        maxPriorityFeePerGas: 0,
        maxFeePerGas: 0,
      })
    })
    const gasLimitEstimationSpy = jest.spyOn(gas, 'estimateGasForTransactionExecution').mockImplementation(() => {
      return Promise.resolve(0)
    })
    jest.spyOn(gas, 'checkTransactionExecution').mockImplementation(jest.fn())

    renderHook(() => useEstimateTransactionGas({ ...mockParams, isExecution: true, txData: 'mockdata' }))

    await waitFor(() => {
      expect(gasPriceEstimationSpy).toHaveBeenCalledTimes(1)
      expect(prioFeeEstimationSpy).toHaveBeenCalledTimes(1)
      expect(gasLimitEstimationSpy).toHaveBeenCalledTimes(1)
    })
  })
})

describe('calculateTotalGasCost', () => {
  it('calculates total gas cost for pre-EIP-1559 txns', () => {
    const [gasCost, gasCostFormatted] = calculateTotalGasCost('53160', '264000000000', '0', 18)

    expect(gasCost).toBe('0.01403424')
    expect(gasCostFormatted).toBe('0.01403')
  })

  it('calculates total gas cost for EIP-1559 txns', () => {
    const [gasCost, gasCostFormatted] = calculateTotalGasCost('53160', '264000000000', '2500000000', 18)

    expect(gasCost).toBe('0.01416714')
    expect(gasCostFormatted).toBe('0.01417')
  })

  it('calculates total gas cost with a non-default max prio fee', () => {
    const [gasCost, gasCostFormatted] = calculateTotalGasCost('53160', '264000000000', '1000000000000', 18)

    expect(gasCost).toBe('0.06719424')
    expect(gasCostFormatted).toBe('0.06719')
  })
})
