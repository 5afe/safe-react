// @flow
import * as React from 'react'
import TestUtils from 'react-dom/test-utils'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import Button from '~/components/layout/Button'
import { aNewStore, history } from '~/store'
import { addEtherTo } from '~/test/addEtherTo'
import { aDeployedSafe } from '~/routes/safe/store/test/builder/deployedSafe.builder'
import { SAFELIST_ADDRESS } from '~/routes/routes'
import SafeView from '~/routes/safe/component/Safe'
import AppRoutes from '~/routes'
import { getBalanceInEtherOf, getWeb3 } from '~/wallets/getWeb3'
import { sleep } from '~/utils/timer'
import { ADD_MULTISIG_BUTTON_TEXT, SEE_MULTISIG_BUTTON_TEXT } from '~/routes/safe/component/Safe/MultisigTx'
import AddTransactionComponent from '~/routes/safe/component/AddTransaction'
import TransactionsComponent from '~/routes/safe/component/Transactions'
import TransactionComponent from '~/routes/safe/component/Transactions/Transaction'
import { promisify } from '~/utils/promisify'
import { processTransaction } from '~/routes/safe/component/Transactions/processTransactions'
import { safeTransactionsSelector, confirmationsTransactionSelector } from '~/routes/safe/store/selectors/index'
import fetchTransactions from '~/routes/safe/store/actions/fetchTransactions'

const renderSafe = localStore => (
  TestUtils.renderIntoDocument((
    <Provider store={localStore}>
      <ConnectedRouter history={history}>
        <AppRoutes />
      </ConnectedRouter>
    </Provider>
  ))
)

describe('React DOM TESTS > Multisig transactions from safe [3 owners & 3 threshold] ', () => {
  let SafeDom
  let store
  let address
  let accounts
  beforeEach(async () => {
    // create store
    store = aNewStore()
    // deploy safe updating store
    address = await aDeployedSafe(store, 10, 3, 3)
    // navigate to SAFE route
    history.push(`${SAFELIST_ADDRESS}/${address}`)
    SafeDom = renderSafe(store)
    accounts = await promisify(cb => getWeb3().eth.getAccounts(cb))
  })

  const listTxs = () => {
    const Safe = TestUtils.findRenderedComponentWithType(SafeDom, SafeView)

    // $FlowFixMe
    const buttons = TestUtils.scryRenderedComponentsWithType(Safe, Button)
    const seeTx = buttons[2]
    expect(seeTx.props.children).toEqual(SEE_MULTISIG_BUTTON_TEXT)
    TestUtils.Simulate.click(TestUtils.scryRenderedDOMComponentsWithTag(seeTx, 'button')[0])
  }

  const createMultisigTxFilling = async () => {
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

  const checkBalanceOf = async (addressToTest: string, value: string) => {
    const safeBalance = await getBalanceInEtherOf(addressToTest)
    expect(safeBalance).toBe(value)
  }

  const addFundsTo = async (destination: string) => {
    // add funds to safe
    await addEtherTo(destination, '0.1')
    const Safe = TestUtils.findRenderedComponentWithType(SafeDom, SafeView)

    // $FlowFixMe
    const buttons = TestUtils.scryRenderedComponentsWithType(Safe, Button)
    const addTxButton = buttons[1]
    expect(addTxButton.props.children).toEqual(ADD_MULTISIG_BUTTON_TEXT)
    await sleep(1800) // Give time to enable Add button
    TestUtils.Simulate.click(TestUtils.scryRenderedDOMComponentsWithTag(addTxButton, 'button')[0])
  }

  const getTransactionFromReduxStore = () => {
    const transactions = safeTransactionsSelector(store.getState(), { safeAddress: address })

    return transactions.get(0)
  }

  const getAlreadyConfirmed = () => {
    const tx = getTransactionFromReduxStore()
    const confirmed = confirmationsTransactionSelector(store.getState(), { transaction: tx })

    return confirmed
  }

  const getTagFromTransaction = (tag: string) => {
    const Transactions = TestUtils.findRenderedComponentWithType(SafeDom, TransactionsComponent)
    if (!Transactions) throw new Error()
    const Transaction = TestUtils.findRenderedComponentWithType(Transactions, TransactionComponent)
    if (!Transaction) throw new Error()

    return TestUtils.scryRenderedDOMComponentsWithTag(Transaction, tag)
  }

  const expandTransactionOf = async (numOwners) => {
    const paragraphs = getTagFromTransaction('p')
    TestUtils.Simulate.click(paragraphs[2]) // expanded
    await sleep(1000) // Time to expand
    const paragraphsExpanded = getTagFromTransaction('p')
    const threshold = paragraphsExpanded[5]
    expect(threshold.innerHTML).toContain('confirmations needed')
    TestUtils.Simulate.click(threshold) // expanded
    await sleep(1000) // Time to expand
    expect(paragraphsExpanded.length).toBe(paragraphs.length + numOwners)
  }

  const confirmOwners = async (...statusses: string[]) => {
    const paragraphsWithOwners = getTagFromTransaction('h3')
    for (let i = 0; i < statusses.length; i += 1) {
      const ownerIndex = i + 6
      const ownerParagraph = paragraphsWithOwners[ownerIndex].innerHTML
      expect(statusses[i]).toEqual(ownerParagraph)
    }
  }

  const makeConfirmation = async (executor) => {
    const alreadyConfirmed = getAlreadyConfirmed()
    const tx = getTransactionFromReduxStore()
    await processTransaction(address, tx, alreadyConfirmed, executor)
    await sleep(800)
    store.dispatch(fetchTransactions())
    sleep(1800)
    SafeDom = renderSafe(store)
    sleep(1800)
    await listTxs()
    sleep(800)
    await expandTransactionOf(3)
    sleep(800)
  }

  it('should execute transaction after 2 owners have confirmed and the last one executed correctly', async () => {
    await addFundsTo(address)
    await createMultisigTxFilling()

    await checkBalanceOf(address, '0.1')
    await listTxs()

    const paragraphs = getTagFromTransaction('p')

    const status = paragraphs[2].innerHTML
    expect(status).toBe('1 of the 3 confirmations needed')

    const confirmed = paragraphs[3].innerHTML
    expect(confirmed).toBe('Waiting for the rest of confirmations')

    await expandTransactionOf(3)
    await confirmOwners('Adolfo 1 Eth Account [Confirmed]', 'Adolfo 2 Eth Account [Not confirmed]', 'Adolfo 3 Eth Account [Not confirmed]')

    await makeConfirmation(accounts[1])
    await confirmOwners('Adolfo 1 Eth Account [Confirmed]', 'Adolfo 2 Eth Account [Confirmed]', 'Adolfo 3 Eth Account [Not confirmed]')

    await makeConfirmation(accounts[2])
    await confirmOwners('Adolfo 1 Eth Account [Confirmed]', 'Adolfo 2 Eth Account [Confirmed]', 'Adolfo 3 Eth Account [Confirmed]')

    const paragraphsExecuted = getTagFromTransaction('p')

    const statusExecuted = paragraphsExecuted[2].innerHTML
    expect(statusExecuted).toBe('Already executed')

    const confirmedExecuted = paragraphsExecuted[3].innerHTML
    const tx = getTransactionFromReduxStore()
    expect(confirmedExecuted).toBe(tx.get('tx'))
  })
})
