import { renderHook, act } from '@testing-library/react-hooks'
import { useAsyncAbortable } from '../useAsyncAbortable'
import * as React from 'react'
import { waitFor } from '@testing-library/dom'

describe('useAsyncAbortable', () => {
  it('should call the async function', async () => {
    const mockFn = jest.fn()

    const { result } = renderHook(() => useAsyncAbortable(mockFn))

    await act(async () => {
      await result.current.abortableFn()
    })

    expect(mockFn).toHaveBeenCalledTimes(1)
  })
  it('should abort the async function', async () => {
    const abortSpy = jest.spyOn(AbortController.prototype, 'abort')

    const { result } = renderHook(() => useAsyncAbortable(jest.fn()))

    await act(async () => {
      await result.current.abortableFn() // Assigns AbortController to ref
      result.current.abort()
    })

    expect(abortSpy).toHaveBeenCalledTimes(1)
  })
  it('should return a loading flag', async () => {
    const setStateMock = jest.fn()

    jest.spyOn(React, 'useState').mockImplementation(() => [, setStateMock])

    const { result } = renderHook(() => useAsyncAbortable(jest.fn()))

    await act(async () => {
      await result.current.abortableFn()
    })

    waitFor(() => {
      // setIsLoading(true), setIsLoading(false)
      expect(setStateMock).toHaveBeenCalledTimes(2)
    })
  })
  it('should abort previous async functions', async () => {
    const { result } = renderHook(() => useAsyncAbortable(jest.fn()))

    let res

    await act(async () => {
      res = await result.current.abortableFn('first call')

      // Abort at the same time as starting
      Promise.all([result.current.abortableFn('second call'), result.current.abort()])
    })

    waitFor(() => {
      expect(res).toBe('first call')
    })
  })
})
