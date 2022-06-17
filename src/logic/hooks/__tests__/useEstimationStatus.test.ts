import { renderHook } from '@testing-library/react-hooks'
import { waitFor } from 'src/utils/test-utils'
import { EstimationStatus } from 'src/logic/hooks/useEstimateTransactionGas'
import { useEstimationStatus } from 'src/logic/hooks/useEstimationStatus'
import { ButtonStatus } from 'src/components/Modal'

describe('useEstimationStatus', () => {
  it('returns LOADING if estimation is LOADING', async () => {
    const { result } = renderHook(() => useEstimationStatus(EstimationStatus.LOADING))

    await waitFor(() => {
      expect(result.current[0]).toBe(ButtonStatus.LOADING)
    })
  })

  it('returns READY if estimation is FAILURE', async () => {
    const { result } = renderHook(() => useEstimationStatus(EstimationStatus.FAILURE))

    await waitFor(() => {
      expect(result.current[0]).toBe(ButtonStatus.READY)
    })
  })

  it('returns READY if estimation is SUCCESS', async () => {
    const { result } = renderHook(() => useEstimationStatus(EstimationStatus.SUCCESS))

    await waitFor(() => {
      expect(result.current[0]).toBe(ButtonStatus.READY)
    })
  })
})
