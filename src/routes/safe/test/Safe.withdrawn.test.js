// @flow
import * as React from 'react'
import TestUtils from 'react-dom/test-utils'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import Button from '~/components/layout/Button'
import { aNewStore, history } from '~/store'
import { addEtherTo } from '~/test/utils/etherMovements'
import { aDeployedSafe, executeWithdrawnOn } from '~/routes/safe/store/test/builder/deployedSafe.builder'
import { SAFELIST_ADDRESS } from '~/routes/routes'
import SafeView from '~/routes/safe/component/Safe'
import AppRoutes from '~/routes'
import { WITHDRAWN_BUTTON_TEXT } from '~/routes/safe/component/Safe/DailyLimit'
import WithdrawnComponent, { SEE_TXS_BUTTON_TEXT } from '~/routes/safe/component/Withdrawn'
import { getBalanceInEtherOf } from '~/wallets/getWeb3'
import { sleep } from '~/utils/timer'
import { getDailyLimitFrom } from '~/routes/safe/component/Withdrawn/withdrawn'
import { type DailyLimitProps } from '~/routes/safe/store/model/dailyLimit'
import { ADD_MULTISIG_BUTTON_TEXT } from '~/routes/safe/component/Safe/MultisigTx'

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

  it('should withdrawn funds under dailyLimit without needing confirmations', async () => {
    // add funds to safe
    await addEtherTo(address, '0.1')
    await sleep(3000)
    const Safe = TestUtils.findRenderedComponentWithType(SafeDom, SafeView)

    // $FlowFixMe
    const buttons = TestUtils.scryRenderedComponentsWithType(Safe, Button)
    const withdrawnButton = buttons[2]
    expect(withdrawnButton.props.children).toEqual(WITHDRAWN_BUTTON_TEXT)
    TestUtils.Simulate.click(TestUtils.scryRenderedDOMComponentsWithTag(withdrawnButton, 'button')[0])
    await sleep(4000)
    const Withdrawn = TestUtils.findRenderedComponentWithType(SafeDom, WithdrawnComponent)

    // $FlowFixMe
    const inputs = TestUtils.scryRenderedDOMComponentsWithTag(Withdrawn, 'input')
    const amountInEth = inputs[0]
    const toAddress = inputs[1]
    TestUtils.Simulate.change(amountInEth, { target: { value: '0.01' } })
    TestUtils.Simulate.change(toAddress, { target: { value: store.getState().providers.account } })

    // $FlowFixMe
    const form = TestUtils.findRenderedDOMComponentWithTag(Withdrawn, 'form')

    TestUtils.Simulate.submit(form) // fill the form
    TestUtils.Simulate.submit(form) // confirming data
    await sleep(6000)

    const safeBalance = await getBalanceInEtherOf(address)
    expect(safeBalance).toBe('0.09')

    // $FlowFixMe
    const withdrawnButtons = TestUtils.scryRenderedComponentsWithType(Withdrawn, Button)
    const visitTxsButton = withdrawnButtons[0]
    expect(visitTxsButton.props.children).toEqual(SEE_TXS_BUTTON_TEXT)
  })

  it('spentToday dailyLimitModule property is updated correctly', async () => {
    // add funds to safe
    await addEtherTo(address, '0.1')

    // GIVEN in beforeEach
    // WHEN
    await executeWithdrawnOn(address, 0.01)
    await executeWithdrawnOn(address, 0.01)

    const ethAddress = 0
    const dailyLimit: DailyLimitProps = await getDailyLimitFrom(address, ethAddress)

    // THEN
    expect(dailyLimit.value).toBe(0.5)
    expect(dailyLimit.spentToday).toBe(0.02)
  })

  it('add multisig txs button disabled when balance is 0', async () => {
    const Safe = TestUtils.findRenderedComponentWithType(SafeDom, SafeView)
    // $FlowFixMe
    const buttons = TestUtils.scryRenderedComponentsWithType(Safe, Button)
    const addTxButton = buttons[3]
    expect(addTxButton.props.children).toEqual(ADD_MULTISIG_BUTTON_TEXT)
    expect(addTxButton.props.disabled).toBe(true)

    await addEtherTo(address, '0.1')
    await sleep(1800)

    expect(addTxButton.props.disabled).toBe(false)
  })

  it('Withdrawn button disabled when balance is 0', async () => {
    const Safe = TestUtils.findRenderedComponentWithType(SafeDom, SafeView)
    // $FlowFixMe
    const buttons = TestUtils.scryRenderedComponentsWithType(Safe, Button)
    const addTxButton = buttons[2]
    expect(addTxButton.props.children).toEqual(WITHDRAWN_BUTTON_TEXT)
    expect(addTxButton.props.disabled).toBe(true)

    await addEtherTo(address, '0.1')
    await sleep(1800)

    expect(addTxButton.props.disabled).toBe(false)
  })
})
