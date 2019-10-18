// @flow
import { type Store } from 'redux'
import { aNewStore, type GlobalState } from '~/store'
import { sleep } from '~/utils/timer'
import Web3Integration from '~/logic/wallets/web3Integration'
import { sendEtherTo } from '~/test/utils/tokenMovements'
import { aMinedSafe } from '~/test/builder/safe.redux.builder'
import { renderSafeView } from '~/test/builder/safe.dom.utils'

export type DomSafe = {
  address: string,
  accounts: string[],
  store: Store<GlobalState>,
  SafeDom: any,
}

export const renderSafeInDom = async (owners: number = 1, threshold: number = 1): Promise<DomSafe> => {
  // create store
  const store = aNewStore()
  // deploy Safe updating store
  const address = await aMinedSafe(store, owners, threshold)
  // have available accounts
  const accounts = await Web3Integration.web3().eth.getAccounts()
  // navigate to SAFE route
  const SafeDom = renderSafeView(store, address)

  // add funds to Safe
  await sendEtherTo(address, '0.1')
  // wait until funds are displayed and buttons are enabled
  await sleep(3000)

  return {
    address,
    SafeDom,
    accounts,
    store,
  }
}
