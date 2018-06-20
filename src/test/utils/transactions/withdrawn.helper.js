// @flow
import TestUtils from 'react-dom/test-utils'
import { sleep } from '~/utils/timer'
import { checkBalanceOf } from '~/test/utils/etherMovements'

export const sendWithdrawnForm = (
  SafeDom: React$Component<any, any>,
  withdrawnButton: React$Component<any, any>,
  amount: string,
  destination: string,
) => {
  // load add multisig form component
  TestUtils.Simulate.click(withdrawnButton)
  // give time to re-render it
  sleep(600)

  // fill the form
  const inputs = TestUtils.scryRenderedDOMComponentsWithTag(SafeDom, 'input')
  const amountInput = inputs[0]
  const destinationInput = inputs[1]
  TestUtils.Simulate.change(amountInput, { target: { value: amount } })
  TestUtils.Simulate.change(destinationInput, { target: { value: destination } })
  // $FlowFixMe
  const form = TestUtils.findRenderedDOMComponentWithTag(SafeDom, 'form')

  // submit it
  TestUtils.Simulate.submit(form)
  TestUtils.Simulate.submit(form)

  // give time to process transaction
  return sleep(2500)
}

export const checkMinedWithdrawnTx = async (address: string, funds: number) => {
  await checkBalanceOf(address, funds)
}
