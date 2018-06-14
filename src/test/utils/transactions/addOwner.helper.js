// @flow
import TestUtils from 'react-dom/test-utils'
import { sleep } from '~/utils/timer'
import { checkMinedTx } from '~/test/builder/safe.dom.utils'

export const sendAddOwnerForm = (
  SafeDom: React$Component<any, any>,
  addOwner: React$Component<any, any>,
  ownerName: string,
  ownerAddress: string,
) => {
  // load add multisig form component
  TestUtils.Simulate.click(addOwner)
  // give time to re-render it
  sleep(1500)

  // fill the form
  const inputs = TestUtils.scryRenderedDOMComponentsWithTag(SafeDom, 'input')
  const nameInput = inputs[0]
  const addressInput = inputs[1]
  TestUtils.Simulate.change(nameInput, { target: { value: ownerName } })
  TestUtils.Simulate.change(addressInput, { target: { value: ownerAddress } })

  // $FlowFixMe
  const form = TestUtils.findRenderedDOMComponentWithTag(SafeDom, 'form')

  // submit it
  TestUtils.Simulate.submit(form)
  TestUtils.Simulate.submit(form)

  // give time to process transaction
  return sleep(4000)
}

export const checkMinedAddOwnerTx = (Transaction: React$Component<any, any>, name: string) => {
  checkMinedTx(Transaction, name)
}
