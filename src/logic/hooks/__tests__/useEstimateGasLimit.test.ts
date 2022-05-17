import { renderHook } from '@testing-library/react-hooks'
import { waitFor } from 'src/utils/test-utils'
import { DEFAULT_GAS_LIMIT, useEstimateGasLimit } from 'src/logic/hooks/useEstimateGasLimit'
import { EMPTY_DATA } from 'src/logic/wallets/ethTransactions'

describe('useEstimateGasLimit', () => {
  it('estimates gasLimit', async () => {
    const mockFn = jest.fn(() => Promise.resolve(21000))

    const { result } = renderHook(() => useEstimateGasLimit(mockFn, true, EMPTY_DATA, undefined))

    await waitFor(() => {
      expect(mockFn).toHaveBeenCalledTimes(1)
      expect(result.current).toBe('21000')
    })
  })

  it('returns default estimation if estimate function throws', async () => {
    const mockFn = jest.fn(() => {
      throw new Error()
    })

    const { result } = renderHook(() => useEstimateGasLimit(mockFn, true, EMPTY_DATA, undefined))

    await waitFor(() => {
      expect(mockFn).toHaveBeenCalledTimes(1)
      expect(result.current).toBe(DEFAULT_GAS_LIMIT)
    })
  })

  it('returns manualGasLimit if it exists instead of estimation', () => {
    const mockManualGasLimit = '30000'
    const mockFn = jest.fn(() => Promise.resolve(21000))

    const { result } = renderHook(() => useEstimateGasLimit(mockFn, true, EMPTY_DATA, mockManualGasLimit))

    expect(result.current).toBe(mockManualGasLimit)
    expect(mockFn).toHaveBeenCalledTimes(0)
  })

  it('returns undefined if not an execution', () => {
    const mockFn = jest.fn(() => Promise.resolve(21000))

    const { result } = renderHook(() => useEstimateGasLimit(mockFn, false, EMPTY_DATA, undefined))

    expect(result.current).toBe(undefined)
  })

  it('returns undefined if txData is empty', () => {
    const mockFn = jest.fn(() => Promise.resolve(21000))

    const { result } = renderHook(() => useEstimateGasLimit(mockFn, true, '', undefined))

    expect(result.current).toBe(undefined)
  })
})
