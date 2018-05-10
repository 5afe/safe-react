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
import { WITHDRAWN_BUTTON_TEXT } from '~/routes/safe/component/Safe/DailyLimit'
import WithdrawnComponent, { SEE_TXS_BUTTON_TEXT } from '~/routes/safe/component/Withdrawn'
import { getBalanceInEtherOf } from '~/wallets/getWeb3'
import { sleep } from '~/utils/timer'

describe('React DOM TESTS > Withdrawn funds from safe', () => {
  let SafeDom
  let store
  let address
  beforeEach(async () => {
    // create store
    store = aNewStore()
    // deploy safe updating store
    address = await aDeployedSafe(store)
    // add funds to safe
    await addEtherTo(address, '0.1')
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
    const Safe = TestUtils.findRenderedComponentWithType(SafeDom, SafeView)

    // $FlowFixMe
    const buttons = TestUtils.scryRenderedComponentsWithType(Safe, Button)
    const withdrawnButton = buttons[0]
    expect(withdrawnButton.props.children).toEqual(WITHDRAWN_BUTTON_TEXT)
    TestUtils.Simulate.click(TestUtils.scryRenderedDOMComponentsWithTag(withdrawnButton, 'button')[0])

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
    await sleep(1200)

    const safeBalance = await getBalanceInEtherOf(address)
    expect(safeBalance).toBe('0.09')

    // $FlowFixMe
    const withdrawnButtons = TestUtils.scryRenderedComponentsWithType(Withdrawn, Button)
    const visitTxsButton = withdrawnButtons[0]
    expect(visitTxsButton.props.children).toEqual(SEE_TXS_BUTTON_TEXT)
  })
})
