// @flow
import TestUtils from 'react-dom/test-utils'
import { SEE_MULTISIG_BUTTON_TEXT } from '~/routes/safe/component/Safe/MultisigTx'
import { sleep } from '~/utils/timer'

export const EXPAND_OWNERS_INDEX = 0
export const ADD_OWNERS_INDEX = 1
export const EDIT_THRESHOLD_INDEX = 2
export const WITHDRAWN_INDEX = 3
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

  expect(nameParagraph).toBe(name)
  expect(statusParagraph).toContain(status)
  expect(hashParagraph).not.toBe('')
  expect(hashParagraph).not.toBe(undefined)
  expect(hashParagraph).not.toBe(null)
  expect(hashParagraph).toContain('0x')
}
