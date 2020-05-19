// 
import { } from 'redux'
import { aNewStore, } from 'store/index'
import { sleep } from 'utils/timer'
import { getWeb3 } from 'logic/wallets/getWeb3'
import { sendEtherTo } from 'test/utils/tokenMovements'
import { aMinedSafe } from 'test/builder/safe.redux.builder'
import { renderSafeView } from 'test/builder/safe.dom.utils'


export const renderSafeInDom = async (owners = 1, threshold = 1) => {
  // create store
  const store = aNewStore()
  // deploy Safe updating store
  const address = await aMinedSafe(store, owners, threshold)
  // have available accounts
  const accounts = await getWeb3().eth.getAccounts()
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
