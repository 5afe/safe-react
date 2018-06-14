// @flow
import TestUtils from 'react-dom/test-utils'
import { sleep } from '~/utils/timer'
import { checkMinedTx, EXPAND_OWNERS_INDEX } from '~/test/builder/safe.dom.utils'

export const sendChangeThresholdForm = (
  SafeDom: React$Component<any, any>,
  expandOwners: React$Component<any, any>,
) => {
  // Expand owners
  TestUtils.Simulate.click(expandOwners)
  sleep(1500)

  // Get delete button user
  const buttons = TestUtils.scryRenderedDOMComponentsWithTag(SafeDom, 'button')
  const removeUserButton = buttons[EXPAND_OWNERS_INDEX + 2] // + 2 one the Add and the next delete
  expect(removeUserButton.getAttribute('aria-label')).toBe('Delete')

  // render form for deleting the user
  TestUtils.Simulate.click(removeUserButton)
  sleep(1500)

  // $FlowFixMe
  const form = TestUtils.findRenderedDOMComponentWithTag(SafeDom, 'form')

  // submit it
  TestUtils.Simulate.submit(form)
  TestUtils.Simulate.submit(form)

  // give time to process transaction
  return sleep(4000)
}

export const checkMinedRemoveOwnerTx = (Transaction: React$Component<any, any>, name: string) => {
  checkMinedTx(Transaction, name)
}
