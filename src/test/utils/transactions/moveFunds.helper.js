// @flow
import TestUtils from 'react-dom/test-utils'
import { sleep } from '~/utils/timer'
import { checkMinedTx, checkPendingTx } from '~/test/builder/safe.dom.utils'

export const sendMoveFundsForm = async (
  SafeDom: React$Component<any, any>,
  expandBalance: React$Component<any, any>,
  value: string,
  destination: string,
) => {
  // load add multisig form component
  TestUtils.Simulate.click(expandBalance)
  // give time to re-render it
  await sleep(600)

  const ethList = TestUtils.findRenderedDOMComponentWithClass(SafeDom, 'ETH')
  if (!ethList) throw new Error()
  const ethButton = ethList.getElementsByTagName('button')
  TestUtils.Simulate.click(ethButton[0])
  await sleep(850)

  // fill the form
  const inputs = TestUtils.scryRenderedDOMComponentsWithTag(SafeDom, 'input')
  const destinationInput = inputs[0]
  const amountInEthInput = inputs[1]
  TestUtils.Simulate.change(amountInEthInput, { target: { value } })
  TestUtils.Simulate.change(destinationInput, { target: { value: destination } })
  // $FlowFixMe
  const form = TestUtils.findRenderedDOMComponentWithTag(SafeDom, 'form')

  // submit it
  TestUtils.Simulate.submit(form)
  TestUtils.Simulate.submit(form)

  // give time to process transaction
  return sleep(2500)
}

export const checkMinedMoveFundsTx = (Transaction: React$Component<any, any>, name: string) => {
  checkMinedTx(Transaction, name)
}

export const checkPendingMoveFundsTx = async (
  Transaction: React$Component<any, any>,
  safeThreshold: number,
  name: string,
  statusses: string[],
) => {
  await checkPendingTx(Transaction, safeThreshold, name, statusses)
}
