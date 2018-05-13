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
import withdrawn, { DESTINATION_PARAM, VALUE_PARAM } from '~/routes/safe/component/Withdrawn/withdrawn'

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

const deploySafe = async (safe: React$Component<{}>, dailyLimit: string) => {
  const inputs = TestUtils.scryRenderedDOMComponentsWithTag(safe, 'input')
  const fieldName = inputs[0]
  const fieldOwners = inputs[1]
  const fieldConfirmations = inputs[2]
  const fieldDailyLimit = inputs[3]

  TestUtils.Simulate.change(fieldOwners, { target: { value: '1' } })
  const inputsExpanded = TestUtils.scryRenderedDOMComponentsWithTag(safe, 'input')
  const ownerName = inputsExpanded[2]

  TestUtils.Simulate.change(fieldName, { target: { value: 'Adolfo Safe' } })
  TestUtils.Simulate.change(fieldConfirmations, { target: { value: '1' } })
  TestUtils.Simulate.change(ownerName, { target: { value: 'Adolfo Eth Account' } })
  TestUtils.Simulate.change(fieldDailyLimit, { target: { value: dailyLimit } })

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
  delete transactionHash.receipt.logsBloom

  return transactionHash
}

export const aDeployedSafe = async (specificStore: Store<GlobalState>, dailyLimit?: number = 0.5) => {
  const safe: React$Component<{}> = await renderSafe(specificStore)
  const deployedSafe = await deploySafe(safe, `${dailyLimit}`)

  return deployedSafe.logs[1].args.proxy
}

export const executeWithdrawnOn = async (safeAddress: string, value: number) => {
  const providerInfo = await getProviderInfo()
  const userAddress = providerInfo.account

  const values = {
    [DESTINATION_PARAM]: userAddress,
    [VALUE_PARAM]: `${value}`,
  }

  await withdrawn(values, safeAddress, userAddress)
}
