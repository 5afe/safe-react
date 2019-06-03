// @flow
import * as React from 'react'
import { type Store } from 'redux'
import { Provider } from 'react-redux'
import { render, fireEvent, cleanup } from 'react-testing-library'
import { ConnectedRouter } from 'connected-react-router'
import Load from '~/routes/load/container/Load'
import { aNewStore, history, type GlobalState } from '~/store'
import { sleep } from '~/utils/timer'
import { getProviderInfo } from '~/logic/wallets/getWeb3'
import addProvider from '~/logic/wallets/store/actions/addProvider'
import { makeProvider } from '~/logic/wallets/store/model/provider'
import { aMinedSafe } from './builder/safe.redux.builder'
import { whenSafeDeployed } from './builder/safe.dom.utils'

afterEach(cleanup)

// https://github.com/testing-library/react-testing-library/issues/281
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (/Warning.*not wrapped in act/.test(args[0])) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})

const renderLoadSafe = async (localStore: Store<GlobalState>) => {
  const provider = await getProviderInfo()
  const walletRecord = makeProvider(provider)
  localStore.dispatch(addProvider(walletRecord))

  return render(
    <Provider store={localStore}>
      <ConnectedRouter history={history}>
        <Load />
      </ConnectedRouter>
    </Provider>,
  )
}

describe('DOM > Feature > LOAD a safe', () => {
  it('load correctly a created safe', async () => {
    const store = aNewStore()
    const address = await aMinedSafe(store)
    const LoadSafePage = await renderLoadSafe(store)
    const form = LoadSafePage.getByTestId('load-safe-form')
    const safeNameInput = LoadSafePage.getByPlaceholderText('Name of the Safe')
    const safeAddressInput = LoadSafePage.getByPlaceholderText('Safe Address*')

    // Fill Safe's name
    fireEvent.change(safeNameInput, { target: { value: 'A Safe To Load' } })
    fireEvent.change(safeAddressInput, { target: { value: address } })
    await sleep(400)

    // Click next
    fireEvent.submit(form)
    await sleep(400)

    // Submit
    fireEvent.submit(form)
    const deployedAddress = await whenSafeDeployed()
    expect(deployedAddress).toBe(address)
  })
})
