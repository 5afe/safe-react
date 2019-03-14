// @flow
import * as TestUtils from 'react-dom/test-utils'
import { travelToTokens } from '~/test/builder/safe.dom.utils'
import { sleep } from '~/utils/timer'
import { type Token } from '~/routes/tokens/store/model/token'

export const enableFirstToken = async (store: Store, safeAddress: string) => {
  const TokensDom = await travelToTokens(store, safeAddress)
  await sleep(400)

  // WHEN
  const inputs = TestUtils.scryRenderedDOMComponentsWithTag(TokensDom, 'input')

  const ethTokenInput = inputs[2]
  expect(ethTokenInput.hasAttribute('disabled')).toBe(true)
  const firstTokenInput = inputs[0]
  expect(firstTokenInput.hasAttribute('disabled')).toBe(false)
  TestUtils.Simulate.change(firstTokenInput, { target: { checked: 'true' } })
}

export const testToken = (token: Token | typeof undefined, symbol: string, status: boolean, funds?: string) => {
  if (!token) throw new Error()
  expect(token.get('symbol')).toBe(symbol)
  expect(token.get('status')).toBe(status)
  if (funds) {
    expect(token.get('funds')).toBe(funds)
  }
}
