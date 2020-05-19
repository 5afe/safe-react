// 
import { } from 'src/logic/tokens/store/model/token'

export const testToken = (token, symbol) => {
  if (!token) throw new Error()
  expect(token.get('symbol')).toBe(symbol)
}
