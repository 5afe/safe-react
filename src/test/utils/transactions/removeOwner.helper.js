// @flow
import TestUtils from 'react-dom/test-utils'
import { sleep } from '~/utils/timer'
import { checkMinedTx, EXPAND_OWNERS_INDEX, checkPendingTx } from '~/test/builder/safe.dom.utils'

export const sendRemoveOwnerForm = (
  SafeDom: React$Component<any, any>,
  expandOwners: React$Component<any, any>,
) => {
  // Expand owners
  TestUtils.Simulate.click(expandOwners)
  sleep(600)

  // Get delete button user
  const buttons = TestUtils.scryRenderedDOMComponentsWithTag(SafeDom, 'button')
  const removeUserButton = buttons[EXPAND_OWNERS_INDEX + 2] // + 2 one the Add and the next delete
  expect(removeUserButton.getAttribute('aria-label')).toBe('Delete')

  // render form for deleting the user
  TestUtils.Simulate.click(removeUserButton)
  sleep(600)

  // $FlowFixMe
  const form = TestUtils.findRenderedDOMComponentWithTag(SafeDom, 'form')

  // submit it
  TestUtils.Simulate.submit(form)
  TestUtils.Simulate.submit(form)

  // give time to process transaction
  return sleep(2500)
}

export const checkMinedRemoveOwnerTx = (Transaction: React$Component<any, any>, name: string) => {
  checkMinedTx(Transaction, name)
}

export const checkPendingRemoveOwnerTx = async (
  Transaction: React$Component<any, any>,
  safeThreshold: number,
  name: string,
  statusses: string[],
) => {
  await checkPendingTx(Transaction, safeThreshold, name, statusses)
}
