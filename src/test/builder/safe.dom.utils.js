// @flow
import TestUtils from 'react-dom/test-utils'
import ListItemText from '~/components/List/ListItemText/index'
import { SEE_MULTISIG_BUTTON_TEXT } from '~/routes/safe/component/Safe/MultisigTx'
import fetchTransactions from '~/routes/safe/store/actions/fetchTransactions'
import { sleep } from '~/utils/timer'

export const EXPAND_OWNERS_INDEX = 0
export const ADD_OWNERS_INDEX = 1
export const EDIT_THRESHOLD_INDEX = 2
export const WITHDRAW_INDEX = 3
export const MOVE_FUNDS_INDEX = 4
export const LIST_TXS_INDEX = 5

export const listTxsClickingOn = async (seeTxsButton: Element) => {
  expect(seeTxsButton.getElementsByTagName('span')[0].innerHTML).toEqual(SEE_MULTISIG_BUTTON_TEXT)
  TestUtils.Simulate.click(seeTxsButton)

  // give some time to expand the transactions
  await sleep(1500)
}

export const checkMinedTx = (Transaction: React$Component<any, any>, name: string) => {
  const paragraphs = TestUtils.scryRenderedDOMComponentsWithTag(Transaction, 'p')

  const status = 'Already executed'
  const nameParagraph = paragraphs[0].innerHTML
  const statusParagraph = paragraphs[2].innerHTML
  const hashParagraph = paragraphs[3].innerHTML

  expect(nameParagraph).toContain(name)
  expect(statusParagraph).toContain(status)
  expect(hashParagraph).not.toBe('')
  expect(hashParagraph).not.toBe(undefined)
  expect(hashParagraph).not.toBe(null)
  expect(hashParagraph).toContain('0x')
}

export const getListItemsFrom = (Transaction: React$Component<any, any>) =>
  TestUtils.scryRenderedComponentsWithType(Transaction, ListItemText)

export const expand = async (Transaction: React$Component<any, any>) => {
  const listItems = getListItemsFrom(Transaction)
  if (listItems.length > 4) {
    return
  }

  TestUtils.Simulate.click(TestUtils.scryRenderedDOMComponentsWithTag(listItems[2], 'p')[0])
  await sleep(1000)

  const listItemsExpanded = getListItemsFrom(Transaction)
  const threshold = listItemsExpanded[5]

  TestUtils.Simulate.click(TestUtils.scryRenderedDOMComponentsWithTag(threshold, 'p')[0])
  await sleep(1000)
}

export const checkPendingTx = async (
  Transaction: React$Component<any, any>,
  safeThreshold: number,
  name: string,
  statusses: string[],
) => {
  await expand(Transaction)
  const listItems = getListItemsFrom(Transaction)

  const txName = listItems[0]
  expect(txName.props.secondary).toContain(name)

  const thresholdItem = listItems[5]
  expect(thresholdItem.props.secondary).toContain(`confirmation${safeThreshold === 1 ? '' : 's'} needed`)

  for (let i = 0; i < statusses.length; i += 1) {
    const ownerIndex = i + 6
    const ownerParagraph = listItems[ownerIndex].props.primary

    expect(statusses[i]).toEqual(ownerParagraph)
  }
}

export const refreshTransactions = async (store) => {
  await store.dispatch(fetchTransactions())
  await sleep(1500)
}
