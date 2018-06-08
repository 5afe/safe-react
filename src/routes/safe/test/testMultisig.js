// @flow
import TestUtils from 'react-dom/test-utils'
import { sleep } from '~/utils/timer'
import { getBalanceInEtherOf } from '~/wallets/getWeb3'
import Button from '~/components/layout/Button'
import { ADD_MULTISIG_BUTTON_TEXT, SEE_MULTISIG_BUTTON_TEXT } from '~/routes/safe/component/Safe/MultisigTx'
import { addEtherTo } from '~/test/addEtherTo'
import SafeView from '~/routes/safe/component/Safe'
import TransactionsComponent from '~/routes/safe/component/Transactions'
import TransactionComponent from '~/routes/safe/component/Transactions/Transaction'
import { safeTransactionsSelector } from '~/routes/safe/store/selectors/index'
import { type GlobalState } from '~/store/index'

export const createMultisigTxFilling = async (
  SafeDom: React$Component<any, any>,
  AddTransactionComponent: React$ElementType,
  store: Store<GlobalState>,
) => {
  // Get AddTransaction form component
  const AddTransaction = TestUtils.findRenderedComponentWithType(SafeDom, AddTransactionComponent)

  // $FlowFixMe
  const inputs = TestUtils.scryRenderedDOMComponentsWithTag(AddTransaction, 'input')
  const name = inputs[0]
  const destination = inputs[1]
  const amountInEth = inputs[2]
  TestUtils.Simulate.change(name, { target: { value: 'Buying betteries' } })
  TestUtils.Simulate.change(amountInEth, { target: { value: '0.01' } })
  TestUtils.Simulate.change(destination, { target: { value: store.getState().providers.account } })

  // $FlowFixMe
  const form = TestUtils.findRenderedDOMComponentWithTag(AddTransaction, 'form')

  TestUtils.Simulate.submit(form) // fill the form
  TestUtils.Simulate.submit(form) // confirming data
  return sleep(4000)
}

export const checkBalanceOf = async (addressToTest: string, value: string) => {
  const safeBalance = await getBalanceInEtherOf(addressToTest)
  expect(safeBalance).toBe(value)
}

export const addFundsTo = async (SafeDom: React$Component<any, any>, destination: string) => {
  // add funds to safe
  await addEtherTo(destination, '0.1')
  const Safe = TestUtils.findRenderedComponentWithType(SafeDom, SafeView)

  // $FlowFixMe
  const buttons = TestUtils.scryRenderedComponentsWithType(Safe, Button)
  const addTxButton = buttons[3]
  expect(addTxButton.props.children).toEqual(ADD_MULTISIG_BUTTON_TEXT)
  await sleep(1800) // Give time to enable Add button
  TestUtils.Simulate.click(TestUtils.scryRenderedDOMComponentsWithTag(addTxButton, 'button')[0])
}

export const listTxsOf = (SafeDom: React$Component<any, any>) => {
  const Safe = TestUtils.findRenderedComponentWithType(SafeDom, SafeView)

  // $FlowFixMe
  const buttons = TestUtils.scryRenderedComponentsWithType(Safe, Button)
  const seeTx = buttons[4]
  expect(seeTx.props.children).toEqual(SEE_MULTISIG_BUTTON_TEXT)
  TestUtils.Simulate.click(TestUtils.scryRenderedDOMComponentsWithTag(seeTx, 'button')[0])
}

export const getTagFromTransaction = (SafeDom: React$Component<any, any>, tag: string) => {
  const Transactions = TestUtils.findRenderedComponentWithType(SafeDom, TransactionsComponent)
  if (!Transactions) throw new Error()
  const Transaction = TestUtils.findRenderedComponentWithType(Transactions, TransactionComponent)
  if (!Transaction) throw new Error()

  return TestUtils.scryRenderedDOMComponentsWithTag(Transaction, tag)
}

export const expandTransactionOf = async (
  SafeDom: React$Component<any, any>,
  numOwners: number,
  safeThreshold: number,
) => {
  const paragraphs = getTagFromTransaction(SafeDom, 'p')
  TestUtils.Simulate.click(paragraphs[2]) // expanded
  await sleep(1000) // Time to expand
  const paragraphsExpanded = getTagFromTransaction(SafeDom, 'p')
  const threshold = paragraphsExpanded[5]
  expect(threshold.innerHTML).toContain(`confirmation${safeThreshold === 1 ? '' : 's'} needed`)
  TestUtils.Simulate.click(threshold) // expanded
  await sleep(1000) // Time to expand
  expect(paragraphsExpanded.length).toBe(paragraphs.length + numOwners)
}

export const getTransactionFromReduxStore = (store: Store<GlobalState>, address: string, index: number = 0) => {
  const transactions = safeTransactionsSelector(store.getState(), { safeAddress: address })

  return transactions.get(index)
}

export const confirmOwners = async (SafeDom: React$Component<any, any>, ...statusses: string[]) => {
  const paragraphsWithOwners = getTagFromTransaction(SafeDom, 'h3')
  for (let i = 0; i < statusses.length; i += 1) {
    const ownerIndex = i + 6
    const ownerParagraph = paragraphsWithOwners[ownerIndex].innerHTML
    expect(statusses[i]).toEqual(ownerParagraph)
  }
}
