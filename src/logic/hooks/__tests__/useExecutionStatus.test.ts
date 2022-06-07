import { renderHook } from '@testing-library/react-hooks'
import { waitFor } from 'src/utils/test-utils'
import { EMPTY_DATA } from 'src/logic/wallets/ethTransactions'
import { useExecutionStatus } from 'src/logic/hooks/useExecutionStatus'
import { EstimationStatus } from 'src/logic/hooks/useEstimateTransactionGas'

describe('useExecutionStatus', () => {
  it('returns LOADING by default', () => {
    const mockGasLimit = '21000'
    const mockFn = jest.fn(() => Promise.resolve(true))

    const { result } = renderHook(() => useExecutionStatus(mockFn, true, EMPTY_DATA, mockGasLimit, '10', '2'))

    expect(result.current).toBe(EstimationStatus.LOADING)
  })

  it('returns LOADING if no gasLimit exists', async () => {
    const mockFn = jest.fn(() => Promise.resolve(true))

    const { result } = renderHook(() => useExecutionStatus(mockFn, true, EMPTY_DATA, undefined, '10', '2'))

    await waitFor(() => {
      expect(result.current).toBe(EstimationStatus.LOADING)
      expect(mockFn).toHaveBeenCalledTimes(0)
    })
  })

  it('returns LOADING if gasLimit is 0', async () => {
    const mockFn = jest.fn(() => Promise.resolve(true))

    const { result } = renderHook(() => useExecutionStatus(mockFn, true, EMPTY_DATA, '0', '10', '2'))

    await waitFor(() => {
      expect(result.current).toBe(EstimationStatus.LOADING)
      expect(mockFn).toHaveBeenCalledTimes(0)
    })
  })

  it('returns LOADING if gasPrice is 0', async () => {
    const mockGasLimit = '21000'
    const mockFn = jest.fn(() => Promise.resolve(true))

    const { result } = renderHook(() => useExecutionStatus(mockFn, true, EMPTY_DATA, mockGasLimit, '0', '2'))

    await waitFor(() => {
      expect(result.current).toBe(EstimationStatus.LOADING)
      expect(mockFn).toHaveBeenCalledTimes(0)
    })
  })

  it('returns LOADING if gasMaxPrioFee is 0', async () => {
    const mockGasLimit = '21000'
    const mockFn = jest.fn(() => Promise.resolve(true))

    const { result } = renderHook(() => useExecutionStatus(mockFn, true, EMPTY_DATA, mockGasLimit, '10', '0'))

    await waitFor(() => {
      expect(result.current).toBe(EstimationStatus.LOADING)
      expect(mockFn).toHaveBeenCalledTimes(0)
    })
  })

  it('returns SUCCESS if callback fn returns true', async () => {
    const mockGasLimit = '21000'
    const mockFn = jest.fn(() => Promise.resolve(true))

    const { result } = renderHook(() => useExecutionStatus(mockFn, true, EMPTY_DATA, mockGasLimit, '10', '2'))

    await waitFor(() => {
      expect(mockFn).toHaveBeenCalledTimes(1)
      expect(result.current).toBe(EstimationStatus.SUCCESS)
    })
  })

  it('returns SUCCESS if not a tx execution', async () => {
    const mockGasLimit = '21000'
    const mockFn = jest.fn(() => Promise.resolve(true))

    const { result } = renderHook(() => useExecutionStatus(mockFn, false, EMPTY_DATA, mockGasLimit, '10', '2'))

    await waitFor(() => {
      expect(mockFn).toHaveBeenCalledTimes(0)
      expect(result.current).toBe(EstimationStatus.SUCCESS)
    })
  })

  it('returns SUCCESS if txData is empty', async () => {
    const mockGasLimit = '21000'
    const mockFn = jest.fn(() => Promise.resolve(true))

    const { result } = renderHook(() => useExecutionStatus(mockFn, true, '', mockGasLimit, '10', '2'))

    await waitFor(() => {
      expect(mockFn).toHaveBeenCalledTimes(0)
      expect(result.current).toBe(EstimationStatus.SUCCESS)
    })
  })

  it('returns FAILURE if callback fn returns false', async () => {
    const mockGasLimit = '21000'
    const mockFn = jest.fn(() => Promise.resolve(false))

    const { result } = renderHook(() => useExecutionStatus(mockFn, true, EMPTY_DATA, mockGasLimit, '10', '2'))

    await waitFor(() => {
      expect(mockFn).toHaveBeenCalledTimes(1)
      expect(result.current).toBe(EstimationStatus.FAILURE)
    })
  })
})
