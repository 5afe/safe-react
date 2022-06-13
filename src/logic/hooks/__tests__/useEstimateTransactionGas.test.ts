import { calculateTotalGasCost, useEstimateTransactionGas } from 'src/logic/hooks/useEstimateTransactionGas'
import { renderHook } from '@testing-library/react-hooks'
import { DEFAULT_MAX_GAS_FEE, DEFAULT_MAX_PRIO_FEE } from 'src/logic/wallets/ethTransactions'
import { fromWei, toWei } from 'web3-utils'
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
      txData: 'mocktxdata',
      isExecution: true,
    }
    initialState = {
      gasPrice: undefined,
      gasPriceFormatted: undefined,
      gasMaxPrioFee: undefined,
      gasMaxPrioFeeFormatted: undefined,
    }
    failureState = {
      gasPrice: DEFAULT_MAX_GAS_FEE.toString(),
      gasPriceFormatted: fromWei(DEFAULT_MAX_GAS_FEE.toString(), 'gwei'),
      gasMaxPrioFee: DEFAULT_MAX_PRIO_FEE.toString(),
      gasMaxPrioFeeFormatted: fromWei(DEFAULT_MAX_PRIO_FEE.toString(), 'gwei'),
    }
  })

  let gasPriceEstimationSpy, prioFeeEstimationSpy
  beforeEach(() => {
    gasPriceEstimationSpy = jest.spyOn(ethTransactions, 'calculateGasPrice').mockImplementation(() => {
      return Promise.resolve('0')
    })
    prioFeeEstimationSpy = jest.spyOn(ethTransactions, 'getFeesPerGas').mockImplementation(() => {
      return Promise.resolve({
        maxPriorityFeePerGas: 0,
        maxFeePerGas: 0,
      })
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('returns initial estimation if tx is not execution', () => {
    const { result } = renderHook(() => useEstimateTransactionGas({ ...mockParams, isExecution: false }))

    expect(result.current).toStrictEqual(initialState)
  })

  it('estimates gas price and max priority fee', async () => {
    renderHook(() => useEstimateTransactionGas(mockParams))

    await waitFor(() => {
      expect(gasPriceEstimationSpy).toHaveBeenCalledTimes(1)
      expect(prioFeeEstimationSpy).toHaveBeenCalledTimes(1)
    })
  })

  it('returns manualGasPrice in Wei if it exists instead of estimation', async () => {
    const mockManualGasPrice = '1'
    const mockGasPrice = toWei(mockManualGasPrice, 'gwei')

    const { result } = renderHook(() =>
      useEstimateTransactionGas({ ...mockParams, manualGasPrice: mockManualGasPrice }),
    )

    await waitFor(() => {
      expect(result.current.gasPrice).toBe(mockGasPrice)
      expect(gasPriceEstimationSpy).toHaveBeenCalledTimes(0)
    })
  })

  it('returns manualMaxPrioFee post EIP-1559 if it exists instead of estimation', async () => {
    jest.spyOn(gas, 'isMaxFeeParam').mockImplementation(() => true)
    const mockManualMaxPrioFee = '1'
    const mockMaxPrioFee = toWei(mockManualMaxPrioFee, 'gwei')

    const { result } = renderHook(() =>
      useEstimateTransactionGas({ ...mockParams, manualMaxPrioFee: mockManualMaxPrioFee }),
    )

    await waitFor(() => {
      expect(result.current.gasMaxPrioFee).toBe(mockMaxPrioFee)
      expect(prioFeeEstimationSpy).toHaveBeenCalledTimes(0)
    })
  })

  it('returns 0 for maxPrioFee pre EIP-1559', async () => {
    jest.spyOn(gas, 'isMaxFeeParam').mockImplementation(() => false)

    const { result } = renderHook(() => useEstimateTransactionGas(mockParams))

    await waitFor(() => {
      expect(result.current.gasMaxPrioFee).toBe('0')
      expect(prioFeeEstimationSpy).toHaveBeenCalledTimes(0)
    })
  })

  it('returns 0 for maxPrioFee pre EIP-1559 if calculateGasPrice throws', async () => {
    jest.spyOn(gas, 'isMaxFeeParam').mockImplementation(() => false)
    jest.spyOn(ethTransactions, 'calculateGasPrice').mockImplementation(() => {
      throw new Error()
    })

    const { result } = renderHook(() => useEstimateTransactionGas(mockParams))

    await waitFor(() => {
      expect(result.current.gasMaxPrioFee).toBe('0')
      expect(result.current.gasMaxPrioFeeFormatted).toBe('0')
      expect(prioFeeEstimationSpy).toHaveBeenCalledTimes(0)
    })
  })

  it('returns failure state if getFeesPerGas throws', async () => {
    jest.spyOn(gas, 'isMaxFeeParam').mockImplementation(() => true)
    jest.spyOn(ethTransactions, 'getFeesPerGas').mockImplementation(() => {
      throw new Error()
    })

    const { result } = renderHook(() => useEstimateTransactionGas(mockParams))

    await waitFor(() => {
      expect(result.current).toStrictEqual(failureState)
    })
  })
})

describe('calculateTotalGasCost', () => {
  it('calculates total gas cost for pre-EIP-1559 txns', () => {
    const { gasCost, gasCostFormatted } = calculateTotalGasCost('53160', '264000000000', '0', 18)

    expect(gasCost).toBe('0.01403424')
    expect(gasCostFormatted).toBe('0.01403')
  })

  it('calculates total gas cost for EIP-1559 txns', () => {
    const { gasCost, gasCostFormatted } = calculateTotalGasCost('53160', '264000000000', '2500000000', 18)

    expect(gasCost).toBe('0.01416714')
    expect(gasCostFormatted).toBe('0.01417')
  })

  it('calculates total gas cost with a non-default max prio fee', () => {
    const { gasCost, gasCostFormatted } = calculateTotalGasCost('53160', '264000000000', '1000000000000', 18)

    expect(gasCost).toBe('0.06719424')
    expect(gasCostFormatted).toBe('0.06719')
  })

  it('returns 0 if gasLimit is 0', () => {
    const { gasCost, gasCostFormatted } = calculateTotalGasCost('0', '264000000000', '1000000000000', 18)

    expect(gasCost).toBe('0')
    expect(gasCostFormatted).toBe('0')
  })
})
