import { renderHook } from '@testing-library/react-hooks'
import { waitFor } from 'src/utils/test-utils'
import { EMPTY_DATA } from 'src/logic/wallets/ethTransactions'
import { useExecutionStatus } from 'src/logic/hooks/useExecutionStatus'
import { EstimationStatus } from 'src/logic/hooks/useEstimateTransactionGas'

describe('useExecutionStatus', () => {
  it('returns LOADING by default', () => {
    const mockGasLimit = '21000'
    const mockFn = jest.fn(() => Promise.resolve(true))

    const { result } = renderHook(() =>
      useExecutionStatus({
        checkTxExecution: mockFn,
        isExecution: true,
        txData: EMPTY_DATA,
        gasLimit: mockGasLimit,
        gasPrice: '10',
        gasMaxPrioFee: '2',
      }),
    )

    expect(result.current).toBe(EstimationStatus.LOADING)
  })

  it('returns LOADING if no gasLimit exists', async () => {
    const mockFn = jest.fn(() => Promise.resolve(true))

    const { result } = renderHook(() =>
      useExecutionStatus({
        checkTxExecution: mockFn,
        isExecution: true,
        txData: EMPTY_DATA,
        gasLimit: undefined,
        gasPrice: '10',
        gasMaxPrioFee: '2',
      }),
    )

    await waitFor(() => {
      expect(result.current).toBe(EstimationStatus.LOADING)
      expect(mockFn).toHaveBeenCalledTimes(0)
    })
  })

  it('returns SUCCESS if gasLimit is 0', async () => {
    const mockFn = jest.fn(() => Promise.resolve(true))

    const { result } = renderHook(() =>
      useExecutionStatus({
        checkTxExecution: mockFn,
        isExecution: true,
        txData: EMPTY_DATA,
        gasLimit: '0',
        gasPrice: '10',
        gasMaxPrioFee: '2',
      }),
    )

    await waitFor(() => {
      expect(result.current).toBe(EstimationStatus.SUCCESS)
      expect(mockFn).toHaveBeenCalledTimes(1)
    })
  })

  it('returns LOADING if gasPrice is undefined', async () => {
    const mockGasLimit = '21000'
    const mockFn = jest.fn(() => Promise.resolve(true))

    const { result } = renderHook(() =>
      useExecutionStatus({
        checkTxExecution: mockFn,
        isExecution: true,
        txData: EMPTY_DATA,
        gasLimit: mockGasLimit,
        gasPrice: undefined,
        gasMaxPrioFee: '2',
      }),
    )

    await waitFor(() => {
      expect(result.current).toBe(EstimationStatus.LOADING)
      expect(mockFn).toHaveBeenCalledTimes(0)
    })
  })

  it('returns LOADING if gasMaxPrioFee is undefined', async () => {
    const mockGasLimit = '21000'
    const mockFn = jest.fn(() => Promise.resolve(true))

    const { result } = renderHook(() =>
      useExecutionStatus({
        checkTxExecution: mockFn,
        isExecution: true,
        txData: EMPTY_DATA,
        gasLimit: mockGasLimit,
        gasPrice: '10',
        gasMaxPrioFee: undefined,
      }),
    )

    await waitFor(() => {
      expect(result.current).toBe(EstimationStatus.LOADING)
      expect(mockFn).toHaveBeenCalledTimes(0)
    })
  })

  it('returns SUCCESS if gasMaxPrioFee is 0', async () => {
    const mockGasLimit = '21000'
    const mockFn = jest.fn(() => Promise.resolve(true))

    const { result } = renderHook(() =>
      useExecutionStatus({
        checkTxExecution: mockFn,
        isExecution: true,
        txData: EMPTY_DATA,
        gasLimit: mockGasLimit,
        gasPrice: '10',
        gasMaxPrioFee: '0',
      }),
    )

    await waitFor(() => {
      expect(result.current).toBe(EstimationStatus.SUCCESS)
      expect(mockFn).toHaveBeenCalledTimes(1)
    })
  })

  it('returns SUCCESS if callback fn returns true', async () => {
    const mockGasLimit = '21000'
    const mockFn = jest.fn(() => Promise.resolve(true))

    const { result } = renderHook(() =>
      useExecutionStatus({
        checkTxExecution: mockFn,
        isExecution: true,
        txData: EMPTY_DATA,
        gasLimit: mockGasLimit,
        gasPrice: '10',
        gasMaxPrioFee: '2',
      }),
    )

    await waitFor(() => {
      expect(mockFn).toHaveBeenCalledTimes(1)
      expect(result.current).toBe(EstimationStatus.SUCCESS)
    })
  })

  it('returns SUCCESS if not a tx execution', async () => {
    const mockGasLimit = '21000'
    const mockFn = jest.fn(() => Promise.resolve(true))

    const { result } = renderHook(() =>
      useExecutionStatus({
        checkTxExecution: mockFn,
        isExecution: false,
        txData: EMPTY_DATA,
        gasLimit: mockGasLimit,
        gasPrice: '10',
        gasMaxPrioFee: '2',
      }),
    )

    await waitFor(() => {
      expect(mockFn).toHaveBeenCalledTimes(0)
      expect(result.current).toBe(EstimationStatus.SUCCESS)
    })
  })

  it('returns SUCCESS if txData is empty', async () => {
    const mockGasLimit = '21000'
    const mockFn = jest.fn(() => Promise.resolve(true))

    const { result } = renderHook(() =>
      useExecutionStatus({
        checkTxExecution: mockFn,
        isExecution: true,
        txData: '',
        gasLimit: mockGasLimit,
        gasPrice: '10',
        gasMaxPrioFee: '2',
      }),
    )

    await waitFor(() => {
      expect(mockFn).toHaveBeenCalledTimes(0)
      expect(result.current).toBe(EstimationStatus.SUCCESS)
    })
  })

  it('returns FAILURE if callback fn returns false', async () => {
    const mockGasLimit = '21000'
    const mockFn = jest.fn(() => Promise.resolve(false))

    const { result } = renderHook(() =>
      useExecutionStatus({
        checkTxExecution: mockFn,
        isExecution: true,
        txData: EMPTY_DATA,
        gasLimit: mockGasLimit,
        gasPrice: '10',
        gasMaxPrioFee: '2',
      }),
    )

    await waitFor(() => {
      expect(mockFn).toHaveBeenCalledTimes(1)
      expect(result.current).toBe(EstimationStatus.FAILURE)
    })
  })

  it('returns FAILURE if callback fn throws', async () => {
    const mockGasLimit = '21000'
    const mockFn = jest.fn(() => {
      throw new Error()
    })

    const { result } = renderHook(() =>
      useExecutionStatus({
        checkTxExecution: mockFn,
        isExecution: true,
        txData: EMPTY_DATA,
        gasLimit: mockGasLimit,
        gasPrice: '10',
        gasMaxPrioFee: '2',
      }),
    )

    await waitFor(() => {
      expect(result.current).toBe(EstimationStatus.FAILURE)
      expect(mockFn).toHaveBeenCalledTimes(1)
    })
  })
})
