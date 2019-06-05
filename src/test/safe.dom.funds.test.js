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
import 'jest-dom/extend-expect'
import updateSafe from '~/routes/safe/store/actions/updateSafe'
import { BALANCE_ROW_TEST_ID } from '~/routes/safe/components/Balances'

afterEach(cleanup)

describe('DOM > Feature > Funds', () => {
  let store
  let safeAddress: string
  let accounts
  beforeEach(async () => {
    store = aNewStore()
    safeAddress = await aMinedSafe(store)
    accounts = await getWeb3().eth.getAccounts()
  })

  it('Sends ETH with threshold = 1', async () => {
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

    // Fill first send funds screen
    const recipientInput = SafeDom.getByPlaceholderText('Recipient*')
    const amountInput = SafeDom.getByPlaceholderText('Amount*')
    const reviewBtn = SafeDom.getByTestId('review-tx-btn')
    fireEvent.change(recipientInput, { target: { value: accounts[0] } })
    fireEvent.change(amountInput, { target: { value: ethAmount } })
    await sleep(200)
    fireEvent.click(reviewBtn)

    // Submit the tx (Review Tx screen)
    const submitBtn = SafeDom.getByTestId('submit-tx-btn')
    fireEvent.click(submitBtn)
    await sleep(1000)

    // THEN
    const safeFunds = await getBalanceInEtherOf(safeAddress)
    expect(Number(safeFunds)).toBe(0)

    const receiverFunds = await getBalanceInEtherOf(accounts[0])
    const ESTIMATED_GASCOSTS = 0.1
    expect(Number(parseInt(receiverFunds, 10) - parseInt(balanceAfterSendingEthToSafe, 10))).toBeGreaterThan(
      parseInt(ethAmount, 10) - ESTIMATED_GASCOSTS,
    )
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
    fireEvent.click(sendButtons[1])

    // Fill first send funds screen
    const recipientInput = SafeDom.getByPlaceholderText('Recipient*')
    const amountInput = SafeDom.getByPlaceholderText('Amount*')
    const reviewBtn = SafeDom.getByTestId('review-tx-btn')
    fireEvent.change(recipientInput, { target: { value: tokenReceiver } })
    fireEvent.change(amountInput, { target: { value: tokensAmount } })
    await sleep(200)
    fireEvent.click(reviewBtn)

    // Submit the tx (Review Tx screen)
    const submitBtn = SafeDom.getByTestId('submit-tx-btn')
    fireEvent.click(submitBtn)
    await sleep(1000)

    // THEN
    const safeFunds = await calculateBalanceOf(tokenAddress, safeAddress, 18)
    expect(Number(safeFunds)).toBe(0)
    const receiverFunds = await calculateBalanceOf(tokenAddress, tokenReceiver, 18)
    expect(receiverFunds).toBe(tokensAmount)
  })
})
