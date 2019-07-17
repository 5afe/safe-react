// @flow
import { fireEvent, cleanup } from '@testing-library/react'
import { List } from 'immutable'
import { aNewStore } from '~/store'
import { aMinedSafe } from '~/test/builder/safe.redux.builder'
import { sendTokenTo, sendEtherTo } from '~/test/utils/tokenMovements'
import { renderSafeView } from '~/test/builder/safe.dom.utils'
import { getWeb3, getBalanceInEtherOf } from '~/logic/wallets/getWeb3'
import { dispatchAddTokenToList } from '~/test/utils/transactions/moveTokens.helper'
import { sleep } from '~/utils/timer'
import TokenBalanceRecord from '~/routes/safe/store/models/tokenBalance'
import { calculateBalanceOf } from '~/routes/safe/store/actions/fetchTokenBalances'
import updateActiveTokens from '~/routes/safe/store/actions/updateActiveTokens'
import { addTransactions } from '~/routes/safe/store/actions/addTransactions'
import { buildTransactionFrom } from '~/routes/safe/store/actions/fetchTransactions'
import '@testing-library/jest-dom/extend-expect'
import updateSafe from '~/routes/safe/store/actions/updateSafe'
import { BALANCE_ROW_TEST_ID } from '~/routes/safe/components/Balances'
import { fillAndSubmitSendFundsForm } from './utils/transactions'
import { EMPTY_DATA } from '~/logic/wallets/ethTransactions';

afterEach(cleanup)

describe('DOM > Feature > Sending Funds', () => {
  let store
  let safeAddress: string
  let accounts
  beforeEach(async () => {
    store = aNewStore()
    // using 4th account because other accounts were used in other tests and paid gas
    safeAddress = await aMinedSafe(store, 2, 2)
    accounts = await getWeb3().eth.getAccounts()
  })

  it('Sends ETH with threshold = 2', async () => {
    // GIVEN
    const ethAmount = '5'
    await sendEtherTo(safeAddress, ethAmount)
    const balanceAfterSendingEthToSafe = await getBalanceInEtherOf(accounts[0])

    // WHEN
    const SafeDom = renderSafeView(store, safeAddress)
    await sleep(1300)

    // Open send funds modal
    const balanceRows = SafeDom.getAllByTestId(BALANCE_ROW_TEST_ID)
    expect(balanceRows[0]).toHaveTextContent(`${ethAmount} ETH`)
    const sendButton = SafeDom.getByTestId('balance-send-btn')
    fireEvent.click(sendButton)

    await fillAndSubmitSendFundsForm(SafeDom, sendButton, ethAmount, accounts[0])

    // CONFIRM TX
    const transaction = {
      to: accounts[0],
      value: parseInt(ethAmount, 10) * (10 ** 18),
      data: EMPTY_DATA,
      operation: 0,
      nonce: 0,
      submissionDate: new Date().toISOString(),
      executionDate: null,
      isExecuted: false,
      confirmations: [
        owner: accounts[0],
        submissionDate: new Date().toISOString(),
        
      ]
    }

    // THEN
    const safeFunds = await getBalanceInEtherOf(safeAddress)
    expect(Number(safeFunds)).toBe(0)

    const receiverFunds = await getBalanceInEtherOf(accounts[0])
    const ESTIMATED_GASCOSTS = 0.3
    expect(Number(parseInt(receiverFunds, 10) - parseInt(balanceAfterSendingEthToSafe, 10))).toBeGreaterThan(
      parseInt(ethAmount, 10) - ESTIMATED_GASCOSTS,
    )
  })
})
