// @flow
import { sleep } from '~/utils/timer'
import * as TestUtils from 'react-dom/test-utils'
import AddToken from '~/logic/tokens/component/AddToken'
import { whenOnNext, whenExecuted } from '~/test/utils/logTransactions'

export const clickOnAddToken = async (TokensDom: React$Component<any, any>) => {
  const buttons = TestUtils.scryRenderedDOMComponentsWithTag(TokensDom, 'button')
  expect(buttons.length).toBe(1)
  TestUtils.Simulate.click(buttons[0])
  await sleep(400)
}

export const fillAddress = async (TokensDom: React$Component<any, any>, secondErc20Token: any) => {
  // fill the form
  const AddTokenComponent = TestUtils.findRenderedComponentWithType(TokensDom, AddToken)
  if (!AddTokenComponent) throw new Error()

  const inputs = TestUtils.scryRenderedDOMComponentsWithTag(AddTokenComponent, 'input')
  expect(inputs.length).toBe(1)
  const tokenAddressInput = inputs[0]
  TestUtils.Simulate.change(tokenAddressInput, { target: { value: `${secondErc20Token.address}` } })
  // $FlowFixMe
  const form = TestUtils.findRenderedDOMComponentWithTag(AddTokenComponent, 'form')
  // submit it
  TestUtils.Simulate.submit(form)

  return whenOnNext(TokensDom, AddToken, 1)
}

export const fillHumanReadableInfo = async (TokensDom: React$Component<any, any>) => {
  // fill the form
  const AddTokenComponent = TestUtils.findRenderedComponentWithType(TokensDom, AddToken)
  if (!AddTokenComponent) throw new Error()

  const inputs = TestUtils.scryRenderedDOMComponentsWithTag(AddTokenComponent, 'input')
  expect(inputs.length).toBe(4)
  TestUtils.Simulate.change(inputs[3], { target: { value: 'https://my.token.image/foo' } })
  const form = TestUtils.findRenderedDOMComponentWithTag(AddTokenComponent, 'form')

  // submit it
  TestUtils.Simulate.submit(form)
  TestUtils.Simulate.submit(form)

  return whenExecuted(TokensDom, AddToken)
}
