import { renderHook, act } from '@testing-library/react-hooks'
import { useEstimateSafeTxGas } from 'src/logic/hooks/useEstimateSafeTxGas'
import * as gas from 'src/logic/safe/transactions/gas'

jest.mock('react-redux', () => {
  const original = jest.requireActual('react-redux')
  return {
    ...original,
    useSelector: jest.fn,
  }
})

const actResolve = async (callback: () => unknown): Promise<void> => {
  await act(() => {
    callback()
    return new Promise((reslolve) => {
      setTimeout(reslolve, 0)
    })
  })
}

describe('useEstimateSafeTxGas', () => {
  it(`should return 0 if it is not a tx creation`, async () => {
    const spy = jest.spyOn(gas, 'estimateSafeTxGas')

    await actResolve(() => {
      const { result } = renderHook(() =>
        useEstimateSafeTxGas({
          txAmount: '',
          txData: '0x',
          txRecipient: '',
          isCreation: false,
          isRejectTx: false,
        }),
      )

      expect(result.current).toBe('0')
    })

    expect(spy).toHaveBeenCalledTimes(0)
  })

  it(`should return 0 if it is a reject tx`, async () => {
    const spy = jest.spyOn(gas, 'estimateSafeTxGas')

    await actResolve(() => {
      const { result } = renderHook(() =>
        useEstimateSafeTxGas({
          txAmount: '',
          txData: '0x',
          txRecipient: '',
          isCreation: false,
          isRejectTx: true,
        }),
      )
      expect(result.current).toBe('0')
    })

    expect(spy).toHaveBeenCalledTimes(0)
  })

  it(`should return 0 if tx data is not passed`, async () => {
    const spy = jest.spyOn(gas, 'estimateSafeTxGas')

    await actResolve(() => {
      const { result } = renderHook(() =>
        useEstimateSafeTxGas({
          txAmount: '',
          txData: '',
          txRecipient: '',
          isCreation: true,
          isRejectTx: false,
        }),
      )

      expect(result.current).toBe('0')
    })

    expect(spy).toHaveBeenCalledTimes(0)
  })

  it(`calls estimateSafeTxGas if it is a tx creation`, async () => {
    const spy = jest.spyOn(gas, 'estimateSafeTxGas')

    await actResolve(() => {
      renderHook(() =>
        useEstimateSafeTxGas({
          txAmount: '',
          txData: '0x',
          txRecipient: '',
          isCreation: true,
          isRejectTx: false,
        }),
      )
    })

    expect(spy).toHaveBeenCalledTimes(1)
  })

  it(`returns 0 if estimateSafeTxGas throws`, async () => {
    const spy = jest.spyOn(gas, 'estimateSafeTxGas').mockImplementation(() => {
      throw new Error()
    })

    await actResolve(() => {
      const { result } = renderHook(() =>
        useEstimateSafeTxGas({
          txAmount: '',
          txData: '0x',
          txRecipient: '',
          isCreation: true,
          isRejectTx: false,
        }),
      )
      expect(result.current).toBe('0')
    })

    expect(spy).toHaveBeenCalledTimes(1)
  })
})
