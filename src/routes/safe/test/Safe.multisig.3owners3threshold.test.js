// @flow
import * as React from 'react'
import TestUtils from 'react-dom/test-utils'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import { aNewStore, history } from '~/store'
import { aDeployedSafe } from '~/routes/safe/store/test/builder/deployedSafe.builder'
import { SAFELIST_ADDRESS } from '~/routes/routes'
import AppRoutes from '~/routes'
import { getWeb3 } from '~/wallets/getWeb3'
import { sleep } from '~/utils/timer'
import { promisify } from '~/utils/promisify'
import AddTransactionComponent from '~/routes/safe/component/AddTransaction'
import { processTransaction } from '~/routes/safe/component/Transactions/processTransactions'
import { confirmationsTransactionSelector } from '~/routes/safe/store/selectors/index'
import fetchTransactions from '~/routes/safe/store/actions/fetchTransactions'
import { createMultisigTxFilling, addFundsTo, checkBalanceOf, listTxsOf, getTagFromTransaction, expandTransactionOf, getTransactionFromReduxStore, confirmOwners } from '~/routes/safe/test/testMultisig'

const renderSafe = localStore => (
  TestUtils.renderIntoDocument((
    <Provider store={localStore}>
      <ConnectedRouter history={history}>
        <AppRoutes />
      </ConnectedRouter>
    </Provider>
  ))
)

describe('React DOM TESTS > Multisig transactions from safe [3 owners & 3 threshold] ', () => {
  let SafeDom
  let store
  let address
  let accounts
  beforeEach(async () => {
    // create store
    store = aNewStore()
    // deploy safe updating store
    address = await aDeployedSafe(store, 10, 3, 3)
    // navigate to SAFE route
    history.push(`${SAFELIST_ADDRESS}/${address}`)
    SafeDom = renderSafe(store)
    accounts = await promisify(cb => getWeb3().eth.getAccounts(cb))
  })


  const getAlreadyConfirmed = () => {
    const tx = getTransactionFromReduxStore(store, address)
    const confirmed = confirmationsTransactionSelector(store.getState(), { transaction: tx })

    return confirmed
  }

  const makeConfirmation = async (executor) => {
    const alreadyConfirmed = getAlreadyConfirmed()
    const tx = getTransactionFromReduxStore(store, address)
    await processTransaction(address, tx, alreadyConfirmed, executor)
    await sleep(800)
    store.dispatch(fetchTransactions())
    sleep(1800)
    SafeDom = renderSafe(store)
    sleep(1800)
    await listTxsOf(SafeDom)
    sleep(800)
    await expandTransactionOf(SafeDom, 3, 3)
    sleep(800)
  }

  it('should execute transaction after 2 owners have confirmed and the last one executed correctly', async () => {
    await addFundsTo(SafeDom, address)
    await createMultisigTxFilling(SafeDom, AddTransactionComponent, store)

    await checkBalanceOf(address, '0.1')
    await listTxsOf(SafeDom)
    sleep(800)
    const paragraphs = getTagFromTransaction(SafeDom, 'p')

    const status = paragraphs[2].innerHTML
    expect(status).toBe('1 of the 3 confirmations needed')

    const confirmed = paragraphs[3].innerHTML
    expect(confirmed).toBe('Waiting for the rest of confirmations')

    await expandTransactionOf(SafeDom, 3, 3)
    await confirmOwners(SafeDom, 'Adolfo 1 Eth Account [Confirmed]', 'Adolfo 2 Eth Account [Not confirmed]', 'Adolfo 3 Eth Account [Not confirmed]')

    await makeConfirmation(accounts[1])
    await confirmOwners(SafeDom, 'Adolfo 1 Eth Account [Confirmed]', 'Adolfo 2 Eth Account [Confirmed]', 'Adolfo 3 Eth Account [Not confirmed]')

    await makeConfirmation(accounts[2])
    await confirmOwners(SafeDom, 'Adolfo 1 Eth Account [Confirmed]', 'Adolfo 2 Eth Account [Confirmed]', 'Adolfo 3 Eth Account [Confirmed]')

    const paragraphsExecuted = getTagFromTransaction(SafeDom, 'p')

    const statusExecuted = paragraphsExecuted[2].innerHTML
    expect(statusExecuted).toBe('Already executed')

    const confirmedExecuted = paragraphsExecuted[3].innerHTML
    const tx = getTransactionFromReduxStore(store, address)
    expect(confirmedExecuted).toBe(tx.get('tx'))
  })
})
