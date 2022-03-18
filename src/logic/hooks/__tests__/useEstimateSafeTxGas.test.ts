import { useEstimateSafeTxGas } from 'src/logic/hooks/useEstimateSafeTxGas'
import { renderHook } from '@testing-library/react-hooks'
import * as gas from 'src/logic/safe/transactions/gas'

jest.mock('react-redux', () => {
  const original = jest.requireActual('react-redux')
  return {
    ...original,
    useSelector: jest.fn,
  }
})

describe('useEstimateSafeTxGas', () => {
  it(`should return 0 if it is not a tx creation`, () => {
    const spy = jest.spyOn(gas, 'estimateSafeTxGas')

    const { result } = renderHook(() =>
      useEstimateSafeTxGas({
        txAmount: '',
        txData: '',
        txRecipient: '',
        isCreation: false,
        isRejectTx: false,
      }),
    )
    expect(result.current).toBe('0')
    expect(spy).toHaveBeenCalledTimes(0)
  })

  it(`should return 0 if it is a reject tx`, () => {
    const spy = jest.spyOn(gas, 'estimateSafeTxGas')

    const { result } = renderHook(() =>
      useEstimateSafeTxGas({
        txAmount: '',
        txData: '',
        txRecipient: '',
        isCreation: false,
        isRejectTx: true,
      }),
    )
    expect(result.current).toBe('0')
    expect(spy).toHaveBeenCalledTimes(0)
  })

  it(`calls estimateSafeTxGas if it is a tx creation`, () => {
    const spy = jest.spyOn(gas, 'estimateSafeTxGas')

    renderHook(() =>
      useEstimateSafeTxGas({
        txAmount: '',
        txData: '',
        txRecipient: '',
        isCreation: true,
        isRejectTx: false,
      }),
    )
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it(`returns 0 if estimateSafeTxGas throws`, () => {
    const spy = jest.spyOn(gas, 'estimateSafeTxGas').mockImplementation(() => {
      throw new Error()
    })

    const { result } = renderHook(() =>
      useEstimateSafeTxGas({
        txAmount: '',
        txData: '',
        txRecipient: '',
        isCreation: true,
        isRejectTx: false,
      }),
    )
    expect(spy).toHaveBeenCalledTimes(1)
    expect(result.current).toBe('0')
  })
})
