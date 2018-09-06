// @flow
import { type Store } from 'redux'
import TestUtils from 'react-dom/test-utils'
import SafeView from '~/routes/safe/component/Safe'
import { aNewStore, type GlobalState } from '~/store'
import { sleep } from '~/utils/timer'
import { getWeb3 } from '~/logic/wallets/getWeb3'
import { promisify } from '~/utils/promisify'
import { addEtherTo } from '~/test/utils/tokenMovements'
import { aMinedSafe } from '~/test/builder/safe.redux.builder'
import { travelToSafe } from '~/test/builder/safe.dom.utils'
import { MOVE_FUNDS_BUTTON_TEXT } from '~/routes/safe/component/Safe/BalanceInfo'

export type DomSafe = {
  address: string,
  safeButtons: Element[],
  safe: React$Component<any, any>,
  accounts: string[],
  store: Store<GlobalState>,
}

export const filterMoveButtonsFrom = (buttons: Element[]) =>
  buttons.filter(button => button.getElementsByTagName('span')[0].innerHTML !== MOVE_FUNDS_BUTTON_TEXT)

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
  const SafeDom = travelToSafe(store, address)

  // add funds to safe
  await addEtherTo(address, '0.1')
  // wait until funds are displayed and buttons are enabled
  await sleep(3000)

  // $FlowFixMe
  const Safe = TestUtils.findRenderedComponentWithType(SafeDom, SafeView)
  // $FlowFixMe
  const buttons = TestUtils.scryRenderedDOMComponentsWithTag(Safe, 'button')
  const filteredButtons = filterMoveButtonsFrom(buttons)

  return {
    address, safeButtons: filteredButtons, safe: SafeDom, accounts, store,
  }
}
