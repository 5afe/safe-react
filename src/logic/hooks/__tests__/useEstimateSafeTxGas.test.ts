import { waitFor } from '@testing-library/react'
import { renderHook, act } from '@testing-library/react-hooks'
import { useEstimateSafeTxGas } from 'src/logic/hooks/useEstimateSafeTxGas'
import * as gas from 'src/logic/safe/transactions/gas'
import * as safeTxGas from 'src/routes/safe/components/Transactions/helpers/useSafeTxGas'

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
  it(`should return 0 if the Safe does not require safeTxGas (is an older version)`, async () => {
    jest.spyOn(safeTxGas, 'default').mockImplementation(() => false)
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

      expect(result.current.result).toBe('0')
    })

    expect(spy).toHaveBeenCalledTimes(0)
  })
  it(`should return 0 if it is not a tx creation`, async () => {
    jest.spyOn(safeTxGas, 'default').mockImplementation(() => true)
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

      expect(result.current.result).toBe('0')
    })

    expect(spy).toHaveBeenCalledTimes(0)
  })

  it(`should return 0 if it is a reject tx`, async () => {
    jest.spyOn(safeTxGas, 'default').mockImplementation(() => true)
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
      expect(result.current.result).toBe('0')
    })

    expect(spy).toHaveBeenCalledTimes(0)
  })

  it(`should return 0 if tx data is not passed`, async () => {
    jest.spyOn(safeTxGas, 'default').mockImplementation(() => true)
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

      expect(result.current.result).toBe('0')
    })

    expect(spy).toHaveBeenCalledTimes(0)
  })

  it(`calls estimateSafeTxGas if it is a tx creation`, async () => {
    jest.spyOn(safeTxGas, 'default').mockImplementation(() => true)
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

  it(`return the error object and 0 if estimateSafeTxGas throws`, async () => {
    jest.spyOn(safeTxGas, 'default').mockImplementation(() => true)
    const spy = jest.spyOn(gas, 'estimateSafeTxGas').mockImplementation(() => {
      throw new Error('Estimation failed')
    })

    await actResolve(async () => {
      const { result } = renderHook(() =>
        useEstimateSafeTxGas({
          txAmount: '',
          txData: '0x',
          txRecipient: '',
          isCreation: true,
          isRejectTx: false,
        }),
      )

      await waitFor(() => {
        expect(result.current.result).toBe('0')
        expect(result.current.error?.message).toBe('Estimation failed')
      })
    })

    expect(spy).toHaveBeenCalledTimes(1)
  })
})
