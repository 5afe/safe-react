// 
import * as React from 'react'
import { } from 'redux'
import { Provider } from 'react-redux'
import { render, fireEvent, act } from '@testing-library/react'
import { ConnectedRouter } from 'connected-react-router'
import Load from 'src/routes/load/container/Load'
import { aNewStore, history, } from 'src/store'
import { sleep } from 'src/utils/timer'
import { getProviderInfo, getWeb3 } from 'src/logic/wallets/getWeb3'
import addProvider from 'src/logic/wallets/store/actions/addProvider'
import { makeProvider } from 'src/logic/wallets/store/model/provider'
import { aMinedSafe } from './builder/safe.redux.builder'
import { whenSafeDeployed } from './builder/safe.dom.utils'

// https://github.com/testing-library/@testing-library/react/issues/281
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

const renderLoadSafe = async (localStore) => {
  const web3 = getWeb3()
  const provider = await getProviderInfo(web3)
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

describe('DOM > Feature > LOAD a Safe', () => {
  it('load correctly a created Safe', async () => {
    const store = aNewStore()
    const address = await aMinedSafe(store)
    const LoadSafePage = await renderLoadSafe(store)
    const form = LoadSafePage.getByTestId('load-safe-form')
    const safeNameInput = LoadSafePage.getByPlaceholderText('Name of the Safe')
    const safeAddressInput = LoadSafePage.getByPlaceholderText('Safe Address*')

    // Fill Safe's name
    await act(async () => {
      fireEvent.change(safeNameInput, { target: { value: 'A Safe To Load' } })
      fireEvent.change(safeAddressInput, { target: { value: address } })
      fireEvent.submit(form)

      await sleep(500)
      fireEvent.submit(form)

      await sleep(500)
      fireEvent.submit(form)
    })

    const deployedAddress = await whenSafeDeployed()
    expect(deployedAddress).toBe(address)
  })
})
