import { loadFromSessionStorage, removeFromSessionStorage, saveToSessionStorage } from '..'

describe('loadFromSessionStorage', () => {
  it('returns a parsed value', () => {
    Object.defineProperty(window, 'sessionStorage', {
      writable: true,
      value: {
        getItem: jest.fn(() => '{"test":"value"}'),
      },
    })

    expect(loadFromSessionStorage('test')).toStrictEqual({ test: 'value' })
  })
  it("returns undefined the key doesn't exist", () => {
    Object.defineProperty(window, 'sessionStorage', {
      writable: true,
      value: {
        getItem: jest.fn(),
      },
    })

    expect(loadFromSessionStorage('test')).toBe(undefined)
  })
})

describe('saveToSessionStorage', () => {
  it('saves a stringified value', () => {
    const store: Record<string, any> = {}
    Object.defineProperty(window, 'sessionStorage', {
      writable: true,
      value: {
        setItem: jest.fn((key, value) => {
          store[key] = value
        }),
      },
    })

    saveToSessionStorage('test', true)

    expect(store.test).toBe('true')
  })
})

describe('removeFromSessionStorage', () => {
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
