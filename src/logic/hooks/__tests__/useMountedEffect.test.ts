import { renderHook } from '@testing-library/react-hooks'
import useMountedEffect from 'src/logic/hooks/useMountedEffect'

describe('useMountedEffect', () => {
  it('should not run on first render', () => {
    const func = jest.fn()
    renderHook(() => useMountedEffect(func))
    expect(func).not.toHaveBeenCalled()
  })
  it('should not run on first render', () => {
    const func = jest.fn()
    let dep = true
    renderHook(() => useMountedEffect(func, [dep]))
    expect(func).not.toHaveBeenCalled()
  })
  it('should run after rerender', () => {
    const func = jest.fn()
    const hook = renderHook(() => useMountedEffect(func))
    expect(func).not.toHaveBeenCalled()

    hook.rerender()
    expect(func).toHaveBeenCalledTimes(1)
  })
  it('should not on deps change', () => {
    const func = jest.fn()
    let dep = true
    renderHook(() => useMountedEffect(func, [dep]))
    expect(func).not.toHaveBeenCalled()

    dep = false
    expect(func).toHaveBeenCalledTimes(1)
  })
})
