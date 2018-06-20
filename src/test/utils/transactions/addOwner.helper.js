// @flow
import TestUtils from 'react-dom/test-utils'
import { sleep } from '~/utils/timer'
import { checkMinedTx, checkPendingTx } from '~/test/builder/safe.dom.utils'

export const sendAddOwnerForm = (
  SafeDom: React$Component<any, any>,
  addOwner: React$Component<any, any>,
  ownerName: string,
  ownerAddress: string,
  increase: boolean = false,
) => {
  // load add multisig form component
  TestUtils.Simulate.click(addOwner)
  // give time to re-render it
  sleep(600)

  // fill the form
  const inputs = TestUtils.scryRenderedDOMComponentsWithTag(SafeDom, 'input')
  const nameInput = inputs[0]
  const addressInput = inputs[1]
  TestUtils.Simulate.change(nameInput, { target: { value: ownerName } })
  TestUtils.Simulate.change(addressInput, { target: { value: ownerAddress } })

  if (increase) {
    const increaseInput = inputs[2]
    TestUtils.Simulate.change(increaseInput, { target: { value: 'true' } })
  }

  // $FlowFixMe
  const form = TestUtils.findRenderedDOMComponentWithTag(SafeDom, 'form')

  // submit it
  TestUtils.Simulate.submit(form)
  TestUtils.Simulate.submit(form)

  // give time to process transaction
  return sleep(2500)
}

export const checkMinedAddOwnerTx = (Transaction: React$Component<any, any>, name: string) => {
  checkMinedTx(Transaction, name)
}

export const checkPendingAddOwnerTx = async (
  Transaction: React$Component<any, any>,
  safeThreshold: number,
  name: string,
  statusses: string[],
) => {
  await checkPendingTx(Transaction, safeThreshold, name, statusses)
}
