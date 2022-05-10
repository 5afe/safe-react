import { renderHook } from '@testing-library/react-hooks'
import { createMemoryHistory } from 'history'
import { act } from 'react-dom/test-utils'
import { Router } from 'react-router-dom'
import useSearchParams, { parseSearch } from '../useSearchParams'

const testHistory = createMemoryHistory({ initialEntries: ['/'] })

describe('Search parameter utilities', () => {
  beforeEach(() => {
    testHistory.replace('/')
  })
  describe('parseSearch', () => {
    it('parses a search string into an object', () => {
      const search = '?one=1&two=true&three=false&four=null&five=undefined&six="[1,2,3]"&seven="{"hello":"world"}"'
      expect(parseSearch(search)).toStrictEqual({
        one: 1,
        two: true,
        three: false,
        four: null,
        five: undefined,
        six: [1, 2, 3],
        seven: { hello: 'world' },
      })
    })
    it('parses encoded URI values', () => {
      const search = '?date=1970-01-01T00%3A00%3A00.000Z&street=Skalitzer%20Stra%C3%9Fe'
      expect(parseSearch(search)).toBe({
        date: '1970-01-01T00:00:00.000Z',
        street: 'Skalitzer Straße',
      })
    })
  })
  describe('useSearchParams', () => {
    it('returns search parameters', () => {
      testHistory.push(
        '/page?one=1&two=true&three=false&four=null&five=undefined&six="[1,2,3]"&seven="{"hello":"world"}"',
      )

      const { result } = renderHook(() => useSearchParams(), {
        wrapper: ({ children }) => <Router history={testHistory}>{children}</Router>,
      })

      expect(result.current[0]).toStrictEqual({
        one: 1,
        two: true,
        three: false,
        four: null,
        five: undefined,
        six: [1, 2, 3],
        seven: { hello: 'world' },
      })
    })
    it('sets the search parameters', () => {
      testHistory.push('/test?one=1')

      const { result } = renderHook(() => useSearchParams(), {
        wrapper: ({ children }) => <Router history={testHistory}>{children}</Router>,
      })
      const [searchParams, setSearchParams] = result.current

      act(() => {
        setSearchParams({ name: 'Safe' })
      })

      expect(location.pathname).toBe('/test?name=Safe')
      expect(searchParams).toBe({ name: 'Safe' })
    })
    it('resets the search parameters with an empty object', () => {
      testHistory.push('/other-test?one=1')

      const { result } = renderHook(() => useSearchParams(), {
        wrapper: ({ children }) => <Router history={testHistory}>{children}</Router>,
      })
      const [searchParams, setSearchParams] = result.current

      expect(searchParams).toBe({ one: 1 })

      act(() => {
        setSearchParams({})
      })

      expect(location.pathname).toBe('/other-test')
      expect(searchParams).toBe({})
    })
  })
})
