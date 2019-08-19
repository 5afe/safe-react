// @flow
import { fireEvent } from '@testing-library/react'
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
import '@testing-library/jest-dom/extend-expect'
import updateSafe from '~/routes/safe/store/actions/updateSafe'
import { checkRegisteredTxSend, fillAndSubmitSendFundsForm } from './utils/transactions'
import { BALANCE_ROW_TEST_ID } from '~/routes/safe/components/Balances'

describe('DOM > Feature > Sending Funds', () => {
  let store
  let safeAddress: string
  let accounts
  beforeEach(async () => {
    store = aNewStore()
    // using 4th account because other accounts were used in other tests and paid gas
    safeAddress = await aMinedSafe(store)
    accounts = await getWeb3().eth.getAccounts()
  })

  it('Sends ETH with threshold = 1', async () => {
    // GIVEN
    const ethAmount = '5'

    // the tests are run in parallel, lets use account 9 because it's not used anywhere else
    // (in other tests we trigger transactions and pay gas for it, so we can't really make reliable
    // assumptions on account's ETH balance)
    await sendEtherTo(safeAddress, ethAmount, 9)

    // WHEN
    const SafeDom = renderSafeView(store, safeAddress)
    await sleep(1300)

    // Open send funds modal
    const balanceRows = SafeDom.getAllByTestId(BALANCE_ROW_TEST_ID)
    expect(balanceRows[0]).toHaveTextContent(`${ethAmount} ETH`)
    const sendButton = SafeDom.getByTestId('balance-send-btn')
    fireEvent.click(sendButton)

    const receiverBalanceBeforeTx = await getBalanceInEtherOf(accounts[9])
    await fillAndSubmitSendFundsForm(SafeDom, sendButton, ethAmount, accounts[9])

    // THEN
    const safeFunds = await getBalanceInEtherOf(safeAddress)
    expect(Number(safeFunds)).toBe(0)
    const receiverBalanceAfterTx = await getBalanceInEtherOf(accounts[9])

    const ESTIMATED_GASCOSTS = 0.3
    expect(Number(parseInt(receiverBalanceAfterTx, 10) - parseInt(receiverBalanceBeforeTx, 10))).toBeGreaterThan(
      parseInt(ethAmount, 10) - ESTIMATED_GASCOSTS,
    )

    // Check that the transaction was registered
    await checkRegisteredTxSend(SafeDom, ethAmount, 'ETH', accounts[9])
  })

  it('Sends Tokens with threshold = 1', async () => {
    // GIVEN
    const tokensAmount = '100'
    const tokenReceiver = accounts[1]
    const tokenAddress = await sendTokenTo(safeAddress, tokensAmount)
    await dispatchAddTokenToList(store, tokenAddress)

    // WHEN
    const SafeDom = await renderSafeView(store, safeAddress)
    await sleep(1300)

    // Activate token
    const safeTokenBalance = await calculateBalanceOf(tokenAddress, safeAddress, 18)
    expect(safeTokenBalance).toBe(tokensAmount)

    const balanceAsRecord = TokenBalanceRecord({
      address: tokenAddress,
      balance: safeTokenBalance,
    })
    store.dispatch(updateActiveTokens(safeAddress, List([tokenAddress])))
    store.dispatch(updateSafe({ address: safeAddress, balances: List([balanceAsRecord]) }))
    await sleep(1000)

    // Open send funds modal
    const balanceRows = SafeDom.getAllByTestId(BALANCE_ROW_TEST_ID)
    expect(balanceRows.length).toBe(2)
    const sendButtons = SafeDom.getAllByTestId('balance-send-btn')
    expect(sendButtons.length).toBe(2)

    await fillAndSubmitSendFundsForm(SafeDom, sendButtons[1], tokensAmount, tokenReceiver)

    // THEN
    const safeFunds = await calculateBalanceOf(tokenAddress, safeAddress, 18)
    expect(Number(safeFunds)).toBe(0)
    const receiverFunds = await calculateBalanceOf(tokenAddress, tokenReceiver, 18)
    expect(receiverFunds).toBe(tokensAmount)

    // Check that the transaction was registered
    await checkRegisteredTxSend(SafeDom, tokensAmount, 'OMG', tokenReceiver)
  })
})
