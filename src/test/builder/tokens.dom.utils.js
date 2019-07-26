// @flow
import { type Token } from '~/logic/tokens/store/model/token'

export const testToken = (token: Token | typeof undefined, symbol: string) => {
  if (!token) throw new Error()
  expect(token.get('symbol')).toBe(symbol)
}
