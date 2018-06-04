// @flow
import * as React from 'react'
import TestUtils from 'react-dom/test-utils'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import { aNewStore, history } from '~/store'
import { aDeployedSafe } from '~/routes/safe/store/test/builder/deployedSafe.builder'
import { SAFELIST_ADDRESS } from '~/routes/routes'
import AppRoutes from '~/routes'
import AddTransactionComponent from '~/routes/safe/component/AddTransaction'
import { safeTransactionsSelector } from '~/routes/safe/store/selectors/index'
import { createMultisigTxFilling, addFundsTo, checkBalanceOf, listTxsOf, getTagFromTransaction, expandTransactionOf } from '~/routes/safe/test/testMultisig'

const renderSafe = localStore => (
  TestUtils.renderIntoDocument((
    <Provider store={localStore}>
      <ConnectedRouter history={history}>
        <AppRoutes />
      </ConnectedRouter>
    </Provider>
  ))
)

describe('React DOM TESTS > Multisig transactions from safe [3 owners & 1 threshold] ', () => {
  let SafeDom
  let store
  let address
  beforeEach(async () => {
    // create store
    store = aNewStore()
    // deploy safe updating store
    address = await aDeployedSafe(store, 10, 1, 3)
    // navigate to SAFE route
    history.push(`${SAFELIST_ADDRESS}/${address}`)
    SafeDom = renderSafe(store)
  })

  const getTransactionFromReduxStore = () => {
    const transactions = safeTransactionsSelector(store.getState(), { safeAddress: address })

    return transactions.get(0)
  }

  const confirmOwners = async (...statusses: string[]) => {
    const paragraphsWithOwners = getTagFromTransaction(SafeDom, 'h3')
    for (let i = 0; i < statusses.length; i += 1) {
      const ownerIndex = i + 6
      const ownerParagraph = paragraphsWithOwners[ownerIndex].innerHTML
      expect(statusses[i]).toEqual(ownerParagraph)
    }
  }

  it('should execute transaction after 2 owners have confirmed and the last one executed correctly', async () => {
    await addFundsTo(SafeDom, address)
    await checkBalanceOf(address, '0.1')
    await createMultisigTxFilling(SafeDom, AddTransactionComponent, store)
    await checkBalanceOf(address, '0.09')
    await listTxsOf(SafeDom)

    await expandTransactionOf(SafeDom, 3)
    await confirmOwners('Adolfo 1 Eth Account [Confirmed]', 'Adolfo 2 Eth Account [Not confirmed]', 'Adolfo 3 Eth Account [Not confirmed]')

    const paragraphs = getTagFromTransaction(SafeDom, 'p')

    const status = paragraphs[2].innerHTML
    expect(status).toBe('Already executed')

    const confirmed = paragraphs[3].innerHTML
    const tx = getTransactionFromReduxStore()
    expect(confirmed).toBe(tx.get('tx'))

    const ownerTx = paragraphs[6].innerHTML
    expect(ownerTx).toBe('Confirmation hash: EXECUTED')
  })
})
