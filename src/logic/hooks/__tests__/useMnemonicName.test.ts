import { getRandomName, useMnemonicName, useMnemonicSafeName } from '../useMnemonicName'
import { renderHook } from '@testing-library/react-hooks'

jest.mock('react', () => {
  const original = jest.requireActual('react')
  return {
    ...original,
    useRef: () => ({ current: '' }),
  }
})

describe('useMnemonicName tests', () => {
  it('should generate a random name', () => {
    expect(getRandomName()).toMatch(/^[a-z-]+-[a-z]+$/)
    expect(getRandomName()).toMatch(/^[a-z-]+-[a-z]+$/)
    expect(getRandomName()).toMatch(/^[a-z-]+-[a-z]+$/)
  })

  it('should work as a hook', () => {
    const result = renderHook(() => useMnemonicName())
    expect(result).toMatch(/^[a-z-]+-[a-z]+$/)
  })

  it('should work as a hook with a noun param', () => {
    const result = renderHook(() => useMnemonicName('test'))
    expect(result).toMatch(/^[a-z-]+-test$/)
  })

  it('should return a random safe name', () => {
    const result = renderHook(() => useMnemonicSafeName())
    expect(result).toMatch(/^[a-z-]+-rinkeby-safe$/)
  })
})
