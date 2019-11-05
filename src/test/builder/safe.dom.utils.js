// @flow
import * as React from 'react'
import TestUtils from 'react-dom/test-utils'
import { type Store } from 'redux'
import { Provider } from 'react-redux'
import { render } from '@testing-library/react'
import { ConnectedRouter } from 'connected-react-router'
import PageFrame from '~/components/layout/PageFrame'
import ListItemText from '~/components/List/ListItemText/index'
import fetchTransactions from '~/routes/safe/store/actions/fetchTransactions'
import { sleep } from '~/utils/timer'
import { history, type GlobalState } from '~/store'
import AppRoutes from '~/routes'
import { SAFELIST_ADDRESS } from '~/routes/routes'
import { EMPTY_DATA } from '~/logic/wallets/ethTransactions'

export const EXPAND_BALANCE_INDEX = 0
export const EXPAND_OWNERS_INDEX = 1
export const ADD_OWNERS_INDEX = 2
export const EDIT_THRESHOLD_INDEX = 3
export const EDIT_INDEX = 4
export const WITHDRAW_INDEX = 5
export const LIST_TXS_INDEX = 6

export const checkMinedTx = (Transaction: React.Component<any, any>, name: string) => {
  const paragraphs = TestUtils.scryRenderedDOMComponentsWithTag(Transaction, 'p')

  const status = 'Already executed'
  const nameParagraph = paragraphs[0].innerHTML
  const statusParagraph = paragraphs[2].innerHTML
  const hashParagraph = paragraphs[3].innerHTML

  expect(nameParagraph).toContain(name)
  expect(statusParagraph).toContain(status)
  expect(hashParagraph).not.toBe('')
  expect(hashParagraph).not.toBe(undefined)
  expect(hashParagraph).not.toBe(null)
  expect(hashParagraph).toContain(EMPTY_DATA)
}

export const getListItemsFrom = (Transaction: React.Component<any, any>) => TestUtils.scryRenderedComponentsWithType(Transaction, ListItemText)

export const expand = async (Transaction: React.Component<any, any>) => {
  const listItems = getListItemsFrom(Transaction)
  if (listItems.length > 4) {
    return
  }

  TestUtils.Simulate.click(TestUtils.scryRenderedDOMComponentsWithTag(listItems[2], 'p')[0])
  await sleep(1000)

  const listItemsExpanded = getListItemsFrom(Transaction)
  const threshold = listItemsExpanded[5]

  TestUtils.Simulate.click(TestUtils.scryRenderedDOMComponentsWithTag(threshold, 'p')[0])
  await sleep(1000)
}

export const checkPendingTx = async (
  Transaction: React.Component<any, any>,
  safeThreshold: number,
  name: string,
  statusses: string[],
) => {
  await expand(Transaction)
  const listItems = getListItemsFrom(Transaction)

  const txName = listItems[0]
  expect(txName.props.secondary).toContain(name)

  const thresholdItem = listItems[5]
  expect(thresholdItem.props.secondary).toContain(`confirmation${safeThreshold === 1 ? '' : 's'} needed`)

  for (let i = 0; i < statusses.length; i += 1) {
    const ownerIndex = i + 6
    const ownerParagraph = listItems[ownerIndex].props.primary

    expect(statusses[i]).toEqual(ownerParagraph)
  }
}

export const refreshTransactions = async (store: Store<GlobalState>, safeAddress: string) => {
  await store.dispatch(fetchTransactions(safeAddress))
  await sleep(1500)
}

const renderApp = (store: Store) => ({
  ...render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <PageFrame>
          <React.Suspense fallback={<div />}>
            <AppRoutes />
          </React.Suspense>
        </PageFrame>
      </ConnectedRouter>
    </Provider>,
  ),
  history,
})

export const renderSafeView = (store: Store<GlobalState>, address: string) => {
  const app = renderApp(store)

  const url = `${SAFELIST_ADDRESS}/${address}/balances`
  history.push(url)

  return app
}

const INTERVAL = 500
const MAX_TIMES_EXECUTED = 30
export const whenSafeDeployed = (): Promise<string> => new Promise((resolve, reject) => {
  let times = 0
  const interval = setInterval(() => {
    if (times >= MAX_TIMES_EXECUTED) {
      clearInterval(interval)
      reject()
    }
    const url = `${window.location}`
    console.log(url)
    const regex = /.*safes\/(0x[a-f0-9A-F]*)/
    const safeAddress = url.match(regex)
    if (safeAddress) {
      resolve(safeAddress[1])
    }
    times += 1
  }, INTERVAL)
})
