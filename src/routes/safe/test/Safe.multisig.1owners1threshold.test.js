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
import AddTransactionComponent, { SEE_TXS_BUTTON_TEXT } from '~/routes/safe/component/AddTransaction'
import TransactionsComponent from '~/routes/safe/component/Transactions'
import TransactionComponent from '~/routes/safe/component/Transactions/Transaction'
import { getBalanceInEtherOf } from '~/wallets/getWeb3'
import { sleep } from '~/utils/timer'
import { ADD_MULTISIG_BUTTON_TEXT } from '~/routes/safe/component/Safe/MultisigTx'
import { safeTransactionsSelector } from '~/routes/safe/store/selectors/index'

describe('React DOM TESTS > Withdrawn funds from safe', () => {
  let SafeDom
  let store
  let address
  beforeEach(async () => {
    // create store
    store = aNewStore()
    // deploy safe updating store
    address = await aDeployedSafe(store)
    // navigate to SAFE route
    history.push(`${SAFELIST_ADDRESS}/${address}`)
    SafeDom = TestUtils.renderIntoDocument((
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <AppRoutes />
        </ConnectedRouter>
      </Provider>
    ))
  })

  it('should execute one transaction if safe has only one owner', async () => {
    // add funds to safe
    await addEtherTo(address, '0.1')
    const Safe = TestUtils.findRenderedComponentWithType(SafeDom, SafeView)

    // $FlowFixMe
    const buttons = TestUtils.scryRenderedComponentsWithType(Safe, Button)
    const addTxButton = buttons[2]
    expect(addTxButton.props.children).toEqual(ADD_MULTISIG_BUTTON_TEXT)
    await sleep(1800) // Give time to enable Add button
    TestUtils.Simulate.click(TestUtils.scryRenderedDOMComponentsWithTag(addTxButton, 'button')[0])

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
    await sleep(4000)

    const safeBalance = await getBalanceInEtherOf(address)
    expect(safeBalance).toBe('0.09')

    // $FlowFixMe
    const addTransactionButtons = TestUtils.scryRenderedComponentsWithType(AddTransaction, Button)
    expect(addTransactionButtons.length).toBe(1)
    const visitTxsButton = addTransactionButtons[0]
    expect(visitTxsButton.props.children).toEqual(SEE_TXS_BUTTON_TEXT)

    // NOW it is time to check the just executed transaction
    TestUtils.Simulate.click(TestUtils.scryRenderedDOMComponentsWithTag(visitTxsButton, 'button')[0])

    const Transactions = TestUtils.findRenderedComponentWithType(SafeDom, TransactionsComponent)
    if (!Transactions) throw new Error()
    const Transaction = TestUtils.findRenderedComponentWithType(Transactions, TransactionComponent)
    if (!Transaction) throw new Error()

    const paragraphs = TestUtils.scryRenderedDOMComponentsWithTag(Transaction, 'p')
    expect(paragraphs[2].innerHTML).toBe('Already executed')
    TestUtils.Simulate.click(paragraphs[2]) // expanded
    await sleep(1000) // Time to expand
    const paragraphsExpanded = TestUtils.scryRenderedDOMComponentsWithTag(Transaction, 'p')
    const txHashParagraph = paragraphsExpanded[3]

    const transactions = safeTransactionsSelector(store.getState(), { safeAddress: address })
    const batteryTx = transactions.get(0)
    if (!batteryTx) throw new Error()
    expect(txHashParagraph.innerHTML).toBe(batteryTx.get('tx'))
  })
})
