import useCanTxExecute from '../useCanTxExecute'
import * as redux from 'react-redux'

const mockedRedux = redux as jest.Mocked<typeof redux> & { useSelector: any }

jest.mock('react-redux', () => {
  const original = jest.requireActual('react-redux')
  return {
    ...original,
    useSelector: () => ({ threshold: 2 }),
  }
})

describe('useCanTxExecute tests', () => {
  it(`should return true if owner of a 1/1 Safe`, () => {
    mockedRedux.useSelector = jest.fn(() => ({ threshold: 1 }))

    const result = useCanTxExecute('0x000', 0)
    expect(result).toBe(true)
  })

  it(`should return false if not an owner and not enough sigs`, () => {
    mockedRedux.useSelector = jest.fn(() => ({ threshold: 1 }))

    const result = useCanTxExecute('', 0)
    expect(result).toBe(false)
  })

  it(`should return true if 2/2 sigs`, () => {
    mockedRedux.useSelector = jest.fn(() => ({ threshold: 2 }))

    const result = useCanTxExecute('', 2)
    expect(result).toBe(true)
  })

  it(`should return true if 1/2 sigs and an owner`, () => {
    mockedRedux.useSelector = jest.fn(() => ({ threshold: 2 }))

    const result = useCanTxExecute('0x000', 1)
    expect(result).toBe(true)
  })

  it(`should return false if 1/3 sigs and an owner`, () => {
    mockedRedux.useSelector = jest.fn(() => ({ threshold: 3 }))

    const result = useCanTxExecute('0x000', 1)
    expect(result).toBe(false)
  })

  it(`should return false if 2/3 sigs and not an owner`, () => {
    mockedRedux.useSelector = jest.fn(() => ({ threshold: 3 }))

    const result = useCanTxExecute('', 2)
    expect(result).toBe(false)
  })
})
