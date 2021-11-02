import { loadFromSessionStorage, removeFromSessionStorage, saveToSessionStorage } from '../session'

describe('loadFromSessionStorage', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
  })
  it('returns a parsed value', () => {
    const stringifiedValue = JSON.stringify({ test: 'value' })
    window.sessionStorage.setItem('test', stringifiedValue)

    expect(loadFromSessionStorage('test')).toStrictEqual({ test: 'value' })
  })
  it("returns undefined the key doesn't exist", () => {
    expect(loadFromSessionStorage('notAKey')).toBe(undefined)
  })
})

describe('saveToSessionStorage', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
  })

  it('saves a stringified value', () => {
    saveToSessionStorage('test', true)

    expect(window.sessionStorage?.test).toBe('true')
  })
})

describe('removeFromSessionStorage', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
  })

  it('removes the key', () => {
    Object.defineProperty(window, 'sessionStorage', {
      writable: true,
      value: {
        removeItem: jest.fn(),
      },
    })

    removeFromSessionStorage('test')

    expect(window.sessionStorage.removeItem).toHaveBeenCalledWith('test')
  })
})
