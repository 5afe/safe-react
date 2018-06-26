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
import { getProviderInfo, getWeb3 } from '~/wallets/getWeb3'
import addProvider from '~/wallets/store/actions/addProvider'
import { makeProvider } from '~/wallets/store/model/provider'
import withdraw, { DESTINATION_PARAM, VALUE_PARAM } from '~/routes/safe/component/Withdraw/withdraw'
import { promisify } from '~/utils/promisify'
import { type Safe } from '~/routes/safe/store/model/safe'

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

const deploySafe = async (safe: React$Component<{}>, dailyLimit: string, threshold: number, numOwners: number) => {
  expect(threshold).toBeLessThanOrEqual(numOwners)
  const inputs = TestUtils.scryRenderedDOMComponentsWithTag(safe, 'input')
  const fieldName = inputs[0]
  const fieldOwners = inputs[1]
  const fieldConfirmations = inputs[2]
  const fieldDailyLimit = inputs[3]

  const web3 = getWeb3()
  const accounts = await promisify(cb => web3.eth.getAccounts(cb))
  TestUtils.Simulate.change(fieldOwners, { target: { value: `${numOwners}` } })
  await sleep(800)
  const inputsExpanded = TestUtils.scryRenderedDOMComponentsWithTag(safe, 'input')
  expect(inputsExpanded.length).toBe((numOwners * 2) + 4) // 2 per owner + name, dailyLimit, confirmations, numOwners

  for (let i = 0; i < numOwners; i += 1) {
    const nameIndex = (i * 2) + 2
    const addressIndex = (i * 2) + 3
    const ownerName = inputsExpanded[nameIndex]
    const account = inputsExpanded[addressIndex]

    TestUtils.Simulate.change(ownerName, { target: { value: `Adolfo ${i + 1} Eth Account` } })
    TestUtils.Simulate.change(account, { target: { value: accounts[i] } })
  }

  TestUtils.Simulate.change(fieldName, { target: { value: 'Adolfo Safe' } })
  TestUtils.Simulate.change(fieldConfirmations, { target: { value: `${threshold}` } })

  TestUtils.Simulate.change(fieldDailyLimit, { target: { value: dailyLimit } })

  const form = TestUtils.findRenderedDOMComponentWithTag(safe, 'form')

  TestUtils.Simulate.submit(form) // fill the form
  TestUtils.Simulate.submit(form) // confirming data
  TestUtils.Simulate.submit(form) // Executing transaction

  // giving some time to the component for updating its state with safe
  // before destroying its context
  await sleep(12000)

  // THEN
  const deployed = TestUtils.findRenderedDOMComponentWithClass(safe, DEPLOYED_COMPONENT_ID)
  if (!deployed) {
    throw new Error()
  }

  const transactionHash = JSON.parse(deployed.getElementsByTagName('pre')[0].innerHTML)
  delete transactionHash.receipt.logsBloom

  return transactionHash
}

export const aDeployedSafe = async (
  specificStore: Store<GlobalState>,
  dailyLimit?: number = 0.5,
  threshold?: number = 1,
  numOwners?: number = 1,
) => {
  const safe: React$Component<{}> = await renderSafe(specificStore)
  const deployedSafe = await deploySafe(safe, `${dailyLimit}`, threshold, numOwners)

  return deployedSafe.logs[1].args.proxy
}

export const executeWithdrawOn = async (safe: Safe, value: number) => {
  const providerInfo = await getProviderInfo()
  const userAddress = providerInfo.account

  const values = {
    [DESTINATION_PARAM]: userAddress,
    [VALUE_PARAM]: `${value}`,
  }

  return withdraw(values, safe, userAddress)
}
