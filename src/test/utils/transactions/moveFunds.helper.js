// @flow
import TestUtils from 'react-dom/test-utils'
import { sleep } from '~/utils/timer'
import { checkMinedTx } from '~/test/builder/safe.dom.utils'

export const sendMoveFundsForm = (
  SafeDom: React$Component<any, any>,
  multisigButton: React$Component<any, any>,
  txName: string,
  value: string,
  destination: string,
) => {
  // load add multisig form component
  TestUtils.Simulate.click(multisigButton)
  // give time to re-render it
  sleep(1500)

  // fill the form
  const inputs = TestUtils.scryRenderedDOMComponentsWithTag(SafeDom, 'input')
  const nameInput = inputs[0]
  const destinationInput = inputs[1]
  const amountInEthInput = inputs[2]
  TestUtils.Simulate.change(nameInput, { target: { value: txName } })
  TestUtils.Simulate.change(amountInEthInput, { target: { value } })
  TestUtils.Simulate.change(destinationInput, { target: { value: destination } })
  // $FlowFixMe
  const form = TestUtils.findRenderedDOMComponentWithTag(SafeDom, 'form')

  // submit it
  TestUtils.Simulate.submit(form)
  TestUtils.Simulate.submit(form)

  // give time to process transaction
  return sleep(4000)
}

export const checkMinedMoveFundsTx = (Transaction: React$Component<any, any>, name: string) => {
  checkMinedTx(Transaction, name)
}
