// @flow
import * as React from 'react'
import { type Store } from 'redux'
import TestUtils from 'react-dom/test-utils'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import Load from '~/routes/load/container/Load'
import { aNewStore, history, type GlobalState } from '~/store'
import { sleep } from '~/utils/timer'
import { getProviderInfo } from '~/logic/wallets/getWeb3'
import addProvider from '~/logic/wallets/store/actions/addProvider'
import { makeProvider } from '~/logic/wallets/store/model/provider'
import { aMinedSafe } from './builder/safe.redux.builder'
import { whenSafeDeployed } from './safe.dom.create.test'

const travelToLoadRoute = async (localStore: Store<GlobalState>) => {
  const provider = await getProviderInfo()
  const walletRecord = makeProvider(provider)
  localStore.dispatch(addProvider(walletRecord))

  return (
    TestUtils.renderIntoDocument((
      <Provider store={localStore}>
        <ConnectedRouter history={history}>
          <Load />
        </ConnectedRouter>
      </Provider>
    ))
  )
}

describe('DOM > Feature > LOAD a safe', () => {
  it('load correctly a created safe', async () => {
    const store = aNewStore()
    const address = await aMinedSafe(store)
    const LoadDom = await travelToLoadRoute(store)

    const form = TestUtils.findRenderedDOMComponentWithTag(LoadDom, 'form')
    const inputs = TestUtils.scryRenderedDOMComponentsWithTag(LoadDom, 'input')

    // Fill Safe's name
    const fieldName = inputs[0]
    TestUtils.Simulate.change(fieldName, { target: { value: 'Adolfo Safe' } })
    TestUtils.Simulate.submit(form)
    await sleep(400)

    // Fill Safe's name
    const fieldAddress = inputs[1]
    TestUtils.Simulate.change(fieldAddress, { target: { value: address } })
    TestUtils.Simulate.submit(form)
    await sleep(400)

    // Submit
    TestUtils.Simulate.submit(form)
    await sleep(400)

    const deployedAddress = await whenSafeDeployed()
    expect(deployedAddress).toBe(address)
  })
})
