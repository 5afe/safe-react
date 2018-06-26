// @flow
import * as React from 'react'
import TestUtils from 'react-dom/test-utils'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import { type Match } from 'react-router-dom'
import Button from '~/components/layout/Button'
import { aNewStore, history } from '~/store'
import { addEtherTo } from '~/test/utils/etherMovements'
import { aDeployedSafe, executeWithdrawOn } from '~/routes/safe/store/test/builder/deployedSafe.builder'
import { SAFELIST_ADDRESS } from '~/routes/routes'
import SafeView from '~/routes/safe/component/Safe'
import AppRoutes from '~/routes'
import { WITHDRAW_BUTTON_TEXT } from '~/routes/safe/component/Safe/DailyLimit'
import WithdrawComponent, { SEE_TXS_BUTTON_TEXT } from '~/routes/safe/component/Withdraw'
import { getBalanceInEtherOf } from '~/wallets/getWeb3'
import { sleep } from '~/utils/timer'
import { getDailyLimitFrom } from '~/routes/safe/component/Withdraw/withdraw'
import { type DailyLimitProps } from '~/routes/safe/store/model/dailyLimit'
import { ADD_MULTISIG_BUTTON_TEXT } from '~/routes/safe/component/Safe/MultisigTx'
import { WITHDRAW_INDEX, MOVE_FUNDS_INDEX } from '~/test/builder/safe.dom.utils'
import { buildMathPropsFrom } from '~/test/utils/buildReactRouterProps'
import { safeSelector } from '~/routes/safe/store/selectors/index'

describe('React DOM TESTS > Withdraw funds from safe', () => {
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

  it('should withdraw funds under dailyLimit without needing confirmations', async () => {
    // add funds to safe
    await addEtherTo(address, '0.1')
    await sleep(3000)
    const Safe = TestUtils.findRenderedComponentWithType(SafeDom, SafeView)

    // $FlowFixMe
    const buttons = TestUtils.scryRenderedDOMComponentsWithTag(Safe, 'button')
    const addWithdrawButton = buttons[WITHDRAW_INDEX]
    expect(addWithdrawButton.getElementsByTagName('span')[0].innerHTML).toEqual(WITHDRAW_BUTTON_TEXT)
    TestUtils.Simulate.click(addWithdrawButton)
    await sleep(4000)
    const Withdraw = TestUtils.findRenderedComponentWithType(SafeDom, WithdrawComponent)

    // $FlowFixMe
    const inputs = TestUtils.scryRenderedDOMComponentsWithTag(Withdraw, 'input')
    const amountInEth = inputs[0]
    const toAddress = inputs[1]
    TestUtils.Simulate.change(amountInEth, { target: { value: '0.01' } })
    TestUtils.Simulate.change(toAddress, { target: { value: store.getState().providers.account } })

    // $FlowFixMe
    const form = TestUtils.findRenderedDOMComponentWithTag(Withdraw, 'form')

    TestUtils.Simulate.submit(form) // fill the form
    TestUtils.Simulate.submit(form) // confirming data
    await sleep(6000)

    const safeBalance = await getBalanceInEtherOf(address)
    expect(safeBalance).toBe('0.09')

    // $FlowFixMe
    const withdrawButtons = TestUtils.scryRenderedComponentsWithType(Withdraw, Button)
    const visitTxsButton = withdrawButtons[0]
    expect(visitTxsButton.props.children).toEqual(SEE_TXS_BUTTON_TEXT)
  })

  it('spentToday dailyLimitModule property is updated correctly', async () => {
    // add funds to safe
    await addEtherTo(address, '0.1')

    const match: Match = buildMathPropsFrom(address)
    const safe = safeSelector(store.getState(), { match })
    if (!safe) throw new Error()
    await executeWithdrawOn(safe, 0.01)
    await executeWithdrawOn(safe, 0.01)

    const ethAddress = 0
    const dailyLimit: DailyLimitProps = await getDailyLimitFrom(address, ethAddress)

    // THEN
    expect(dailyLimit.value).toBe(0.5)
    expect(dailyLimit.spentToday).toBe(0.02)
  })

  it('add multisig txs button disabled when balance is 0', async () => {
    const Safe = TestUtils.findRenderedComponentWithType(SafeDom, SafeView)
    // $FlowFixMe
    const buttons = TestUtils.scryRenderedDOMComponentsWithTag(Safe, 'button')
    const addTxButton = buttons[MOVE_FUNDS_INDEX]
    expect(addTxButton.getElementsByTagName('span')[0].innerHTML).toEqual(ADD_MULTISIG_BUTTON_TEXT)
    expect(addTxButton.hasAttribute('disabled')).toBe(true)

    await addEtherTo(address, '0.1')
    await sleep(1800)

    expect(addTxButton.hasAttribute('disabled')).toBe(false)
  })

  it('Withdraw button disabled when balance is 0', async () => {
    const Safe = TestUtils.findRenderedComponentWithType(SafeDom, SafeView)
    // $FlowFixMe
    const buttons = TestUtils.scryRenderedDOMComponentsWithTag(Safe, 'button')
    const addWithdrawButton = buttons[WITHDRAW_INDEX]
    expect(addWithdrawButton.getElementsByTagName('span')[0].innerHTML).toEqual(WITHDRAW_BUTTON_TEXT)
    expect(addWithdrawButton.hasAttribute('disabled')).toBe(true)

    await addEtherTo(address, '0.1')
    await sleep(1800)

    expect(addWithdrawButton.hasAttribute('disabled')).toBe(false)
  })
})
