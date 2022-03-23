import { renderHook } from '@testing-library/react-hooks'
import useAsync from '../useAsync'

describe('useAsync tests', () => {
  it('returns a successful result', async () => {
    const fakeCallback = jest.fn(() => Promise.resolve('success'))

    const { result, waitForNextUpdate } = renderHook(() => useAsync(fakeCallback))

    await waitForNextUpdate()

    expect(result.current).toEqual({ result: 'success', error: undefined })

    expect(fakeCallback).toHaveBeenCalledTimes(1)
  })

  it('returns an error', async () => {
    const fakeCallback = jest.fn(() => Promise.reject(new Error('failure')))

    const { result, waitForNextUpdate } = renderHook(() => useAsync(fakeCallback))

    await waitForNextUpdate()

    expect(result.current.result).toBe(undefined)
    expect(result.current.error).toBeDefined()
    expect(result.current.error!.message).toBe('failure')

    expect(fakeCallback).toHaveBeenCalledTimes(1)
  })

  it('ignores a stale result if a new request has been launched already', async () => {
    // This will resolve AFTER the second callback but the result should be ignored
    const fakeCallback1 = jest.fn(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve('success 1')
        }, 10)
      })
    })

    const fakeCallback2 = jest.fn(() => Promise.resolve('success 2'))

    let counter = 0
    const { result, waitForNextUpdate, rerender } = renderHook(() => {
      const callback = counter > 0 ? fakeCallback2 : fakeCallback1
      counter += 1
      return useAsync(callback)
    })

    expect(result.current.result).toBe(undefined)
    expect(result.current.error).toBe(undefined)

    rerender() // re-render immediately

    await waitForNextUpdate()

    expect(result.current.result).toBe('success 2')
    expect(result.current.error).toBe(undefined)

    expect(fakeCallback1).toHaveBeenCalledTimes(1)
    expect(fakeCallback2).toHaveBeenCalledTimes(1)
  })
})
