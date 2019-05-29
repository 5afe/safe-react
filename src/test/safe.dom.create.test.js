// @flow
import * as React from 'react'
import { type Store } from 'redux'
import TestUtils from 'react-dom/test-utils'
import { render, fireEvent, cleanup } from 'react-testing-library'
import Select from '@material-ui/core/Select'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import { ADD_OWNER_BUTTON } from '~/routes/open/components/SafeOwnersForm'
import Open from '~/routes/open/container/Open'
import { aNewStore, history, type GlobalState } from '~/store'
import { sleep } from '~/utils/timer'
import { getProviderInfo, getWeb3 } from '~/logic/wallets/getWeb3'
import addProvider from '~/logic/wallets/store/actions/addProvider'
import { makeProvider } from '~/logic/wallets/store/model/provider'
import { getGnosisSafeInstanceAt } from '~/logic/contracts/safeContracts'
import { whenSafeDeployed } from './builder/safe.dom.utils'

afterEach(cleanup)

const fillOpenSafeForm = async (localStore: Store<GlobalState>) => {
  const provider = await getProviderInfo()
  const walletRecord = makeProvider(provider)
  localStore.dispatch(addProvider(walletRecord))

  return render(
    <Provider store={localStore}>
      <ConnectedRouter history={history}>
        <Open />
      </ConnectedRouter>
    </Provider>,
  )
}

const deploySafe = async (safe: React$Component<{}>, threshold: number, numOwners: number) => {
  const web3 = getWeb3()
  const accounts = await web3.eth.getAccounts()

  expect(threshold).toBeLessThanOrEqual(numOwners)
  const form = TestUtils.findRenderedDOMComponentWithTag(safe, 'form')

  // Fill Safe's name
  const inputs = TestUtils.scryRenderedDOMComponentsWithTag(safe, 'input')
  expect(inputs.length).toBe(1)
  const fieldName = inputs[0]
  TestUtils.Simulate.change(fieldName, { target: { value: 'Adolfo Safe' } })
  TestUtils.Simulate.submit(form)
  await sleep(400)

  // Fill owners
  const addedUpfront = 1
  const buttons = TestUtils.scryRenderedDOMComponentsWithTag(safe, 'button')
  const addOwnerButton = buttons[1]
  expect(addOwnerButton.getElementsByTagName('span')[0].textContent).toEqual(ADD_OWNER_BUTTON)
  for (let i = addedUpfront; i < numOwners; i += 1) {
    TestUtils.Simulate.click(addOwnerButton)
  }

  const ownerInputs = TestUtils.scryRenderedDOMComponentsWithTag(safe, 'input')
  expect(ownerInputs.length).toBe(numOwners * 2)
  for (let i = addedUpfront; i < numOwners; i += 1) {
    const nameIndex = i * 2
    const addressIndex = i * 2 + 1
    const ownerName = ownerInputs[nameIndex]
    const account = ownerInputs[addressIndex]

    TestUtils.Simulate.change(ownerName, { target: { value: `Adolfo ${i + 1} Eth Account` } })
    TestUtils.Simulate.change(account, { target: { value: accounts[i] } })
  }
  TestUtils.Simulate.submit(form)
  await sleep(400)

  // Fill Threshold
  const muiSelectFields = TestUtils.scryRenderedComponentsWithType(safe, Select)
  expect(muiSelectFields.length).toEqual(1)
  muiSelectFields[0].props.onChange(`${threshold}`)
  TestUtils.Simulate.submit(form)
  await sleep(400)

  // Submit
  TestUtils.Simulate.submit(form)
  await sleep(400)

  // giving some time to the component for updating its state with safe
  // before destroying its context
  return whenSafeDeployed()
}

const aDeployedSafe = async (specificStore: Store<GlobalState>, threshold?: number = 1, numOwners?: number = 1) => {
  const safe: React$Component<{}> = await fillOpenSafeForm(specificStore)
  const safeAddress = await deploySafe(safe, threshold, numOwners)

  return safeAddress
}

describe('DOM > Feature > CREATE a safe', () => {
  it('fills correctly the safe form with 4 owners and 4 threshold', async () => {
    const owners = 4
    const threshold = 4
    const store = aNewStore()
    const address = await aDeployedSafe(store, threshold, owners)
    expect(address).not.toBe(null)
    expect(address).not.toBe(undefined)

    const gnosisSafe = await getGnosisSafeInstanceAt(address)
    const storedOwners = await gnosisSafe.getOwners()
    expect(storedOwners.length).toEqual(4)
    const safeThreshold = await gnosisSafe.getThreshold()
    expect(Number(safeThreshold)).toEqual(4)
  })
})
