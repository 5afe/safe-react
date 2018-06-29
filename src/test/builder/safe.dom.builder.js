// @flow
import * as React from 'react'
import { type Store } from 'redux'
import TestUtils from 'react-dom/test-utils'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import SafeView from '~/routes/safe/component/Safe'
import { aNewStore, history, type GlobalState } from '~/store'
import { sleep } from '~/utils/timer'
import { getWeb3 } from '~/wallets/getWeb3'
import AppRoutes from '~/routes'
import { SAFELIST_ADDRESS } from '~/routes/routes'
import { promisify } from '~/utils/promisify'
import { addEtherTo } from '~/test/utils/tokenMovements'
import { aMinedSafe } from '~/test/builder/safe.redux.builder'

export type DomSafe = {
  address: string,
  safeButtons: Element[],
  safe: React$Component<any, any>,
  accounts: string[],
  store: Store<GlobalState>,
}

export const renderSafeInDom = async (
  owners: number = 1,
  threshold: number = 1,
  dailyLimit: number = 0.5,
): Promise<DomSafe> => {
  // create store
  const store = aNewStore()
  // deploy safe updating store
  const address = await aMinedSafe(store, owners, threshold, dailyLimit)
  // have available accounts
  const accounts = await promisify(cb => getWeb3().eth.getAccounts(cb))
  // navigate to SAFE route
  history.push(`${SAFELIST_ADDRESS}/${address}`)
  const SafeDom = TestUtils.renderIntoDocument((
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <AppRoutes />
      </ConnectedRouter>
    </Provider>
  ))

  // add funds to safe
  await addEtherTo(address, '0.1')
  // wait until funds are displayed and buttons are enabled
  await sleep(3000)

  // $FlowFixMe
  const Safe = TestUtils.findRenderedComponentWithType(SafeDom, SafeView)
  // $FlowFixMe
  const buttons = TestUtils.scryRenderedDOMComponentsWithTag(Safe, 'button')

  return {
    address, safeButtons: buttons, safe: SafeDom, accounts, store,
  }
}
