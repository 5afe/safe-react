// @flow
import * as React from 'react'
import TestUtils from 'react-dom/test-utils'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import { aNewStore, history } from '~/store'
import { addEtherTo } from '~/test/utils/tokenMovements'
import { executeWithdrawOn } from '~/routes/safe/store/test/builder/deployedSafe.builder'
import { SAFELIST_ADDRESS } from '~/routes/routes'
import SafeView from '~/routes/safe/component/Safe'
import AppRoutes from '~/routes'
import { WITHDRAW_BUTTON_TEXT } from '~/routes/safe/component/Safe/DailyLimit'
import { getBalanceInEtherOf } from '~/wallets/getWeb3'
import { sleep } from '~/utils/timer'
import { getDailyLimitFrom } from '~/routes/safe/component/Withdraw/withdraw'
import { type DailyLimitProps } from '~/routes/safe/store/model/dailyLimit'
import { WITHDRAW_INDEX } from '~/test/builder/safe.dom.utils'
import { aMinedSafe } from '~/test/builder/safe.redux.builder'
import { getSafeFrom } from '~/test/utils/safeHelper'
import { filterMoveButtonsFrom } from '~/test/builder/safe.dom.builder'
import { fetchTokens } from '~/routes/tokens/store/actions/fetchTokens'

describe('React DOM TESTS > Withdraw funds from safe', () => {
  let store
  let safeAddress: string
  beforeEach(async () => {
    store = aNewStore()
    safeAddress = await aMinedSafe(store)
  })

  it('should withdraw funds under dailyLimit without needing confirmations', async () => {
    // add funds to safe
    await addEtherTo(safeAddress, '0.1')

    const safe = getSafeFrom(store.getState(), safeAddress)
    await executeWithdrawOn(safe, 0.01)

    const safeBalance = await getBalanceInEtherOf(safeAddress)
    expect(safeBalance).toBe('0.09')
  })

  it('spentToday dailyLimitModule property is updated correctly', async () => {
    // add funds to safe
    await addEtherTo(safeAddress, '0.1')

    const safe = getSafeFrom(store.getState(), safeAddress)
    await executeWithdrawOn(safe, 0.01)
    await executeWithdrawOn(safe, 0.01)

    const ethAddress = 0
    const dailyLimit: DailyLimitProps = await getDailyLimitFrom(safeAddress, ethAddress)

    // THEN
    expect(dailyLimit.value).toBe(0.5)
    expect(dailyLimit.spentToday).toBe(0.02)
  })

  it('Withdraw button disabled when balance is 0', async () => {
    // navigate to SAFE route
    history.push(`${SAFELIST_ADDRESS}/${safeAddress}`)
    const SafeDom = TestUtils.renderIntoDocument((
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <AppRoutes />
        </ConnectedRouter>
      </Provider>
    ))

    await sleep(300)
    const Safe = TestUtils.findRenderedComponentWithType(SafeDom, SafeView)
    // $FlowFixMe
    const buttons = TestUtils.scryRenderedDOMComponentsWithTag(Safe, 'button')
    const filteredButtons = filterMoveButtonsFrom(buttons)
    const addWithdrawButton = filteredButtons[WITHDRAW_INDEX]
    expect(addWithdrawButton.getElementsByTagName('span')[0].innerHTML).toEqual(WITHDRAW_BUTTON_TEXT)
    expect(addWithdrawButton.hasAttribute('disabled')).toBe(true)

    await addEtherTo(safeAddress, '0.1')
    await store.dispatch(fetchTokens(safeAddress))
    await sleep(150)

    expect(addWithdrawButton.hasAttribute('disabled')).toBe(false)
  })
})
