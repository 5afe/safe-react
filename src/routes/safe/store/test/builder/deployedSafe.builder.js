// @flow
import * as React from 'react'
import { type Store } from 'redux'
import TestUtils from 'react-dom/test-utils'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import { DEPLOYED_COMPONENT_ID } from '~/routes/open/components/FormConfirmation'
import Open from '~/routes/open/container/Open'
import { history, type GlobalState } from '~/store'
import { sleep } from '~/utils/timer'
import { getProviderInfo } from '~/wallets/getWeb3'
import addProvider from '~/wallets/store/actions/addProvider'
import { makeProvider } from '~/wallets/store/model/provider'

export const renderSafe = async (localStore: Store<GlobalState>) => {
  const provider = await getProviderInfo()
  const walletRecord = makeProvider(provider)
  localStore.dispatch(addProvider(walletRecord))

  return (
    TestUtils.renderIntoDocument((
      <Provider store={localStore}>
        <ConnectedRouter history={history}>
          <Open />
        </ConnectedRouter>
      </Provider>
    ))
  )
}

const deploySafe = async (safe: React$Component<{}>) => {
  const inputs = TestUtils.scryRenderedDOMComponentsWithTag(safe, 'input')
  const fieldName = inputs[0]
  const fieldOwners = inputs[1]
  const fieldConfirmations = inputs[2]

  TestUtils.Simulate.change(fieldOwners, { target: { value: '1' } })
  const inputsExpanded = TestUtils.scryRenderedDOMComponentsWithTag(safe, 'input')
  const ownerName = inputsExpanded[2]

  TestUtils.Simulate.change(fieldName, { target: { value: 'Adolfo Safe' } })
  TestUtils.Simulate.change(fieldConfirmations, { target: { value: '1' } })
  TestUtils.Simulate.change(ownerName, { target: { value: 'Adolfo Eth Account' } })

  const form = TestUtils.findRenderedDOMComponentWithTag(safe, 'form')

  TestUtils.Simulate.submit(form) // fill the form
  TestUtils.Simulate.submit(form) // confirming data
  TestUtils.Simulate.submit(form) // Executing transaction

  // giving some time to the component for updating its state with safe
  // before destroying its context
  await sleep(1500)

  // THEN
  const deployed = TestUtils.findRenderedDOMComponentWithClass(safe, DEPLOYED_COMPONENT_ID)
  if (!deployed) {
    throw new Error()
  }

  const transactionHash = JSON.parse(deployed.getElementsByTagName('pre')[0].innerHTML)
  delete transactionHash.logsBloom

  return transactionHash
}

export const aDeployedSafe = async (specificStore: Store<GlobalState>) => {
  const safe: React$Component<{}> = await renderSafe(specificStore)
  const deployedSafe = deploySafe(safe)

  return deployedSafe
}
