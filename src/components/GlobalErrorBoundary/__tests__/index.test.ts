import { handleChunkError } from '..'

describe('handleChunkError', () => {
  beforeEach(() => {
    // Mock window.location.reload
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { reload: jest.fn() },
    })

    window.sessionStorage.clear()
  })

  const lastFallbackReloadKey = 'SAFE__lastFallbackReload'
  const createTestErrorObject = (message: string) => ({ name: 'Test', message })

  it('does not handle non-chunk loading failure errors', () => {
    const testErrorObj = createTestErrorObject('Unrelated error')

    const isChunkError = handleChunkError(testErrorObj)

    expect(sessionStorage.getItem(lastFallbackReloadKey)).toBeNull()
    expect(isChunkError).not.toBeTruthy()
    expect(window.location.reload).not.toHaveBeenCalled()
  })

  const testChunkErrorObj = createTestErrorObject('Loading chunk 123 failed')

  it('handles no sessionStorage value existence', () => {
    const isChunkError = handleChunkError(testChunkErrorObj)

    expect(sessionStorage.getItem(lastFallbackReloadKey)).not.toBeNull()
    expect(isChunkError).toBeTruthy()
    expect(window.location.reload).toHaveBeenCalled()
  })

  it('handles malformed sessionStorage values', () => {
    const sessionStorageValue = 'This is a string'
    sessionStorage.setItem(lastFallbackReloadKey, sessionStorageValue)

    const isChunkError = handleChunkError(testChunkErrorObj)

    expect(sessionStorage.getItem(lastFallbackReloadKey)).not.toBe(sessionStorageValue)
    expect(isChunkError).not.toBeTruthy()
    expect(window.location.reload).not.toHaveBeenCalled()
  })

  it('does not reload if there was a reload within the past 10 seconds', () => {
    const time = new Date().getTime()
    const timeString = time.toString()

    sessionStorage.setItem(lastFallbackReloadKey, timeString)

    const isChunkError = handleChunkError(testChunkErrorObj)

    expect(isChunkError).not.toBeTruthy()
    expect(window.location.reload).not.toHaveBeenCalled()
  })

  it('reload if the reload was more than 10 seconds ago', () => {
    const expiredTime = new Date().getTime() - 11_000
    const expiredTimeString = expiredTime.toString()

    sessionStorage.setItem(lastFallbackReloadKey, expiredTimeString)

    const isChunkError = handleChunkError(testChunkErrorObj)

    expect(isChunkError).toBe(true)
    expect(window.location.reload).toHaveBeenCalledTimes(1)
  })
})
