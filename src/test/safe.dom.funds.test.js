// @flow
import { fireEvent, cleanup } from '@testing-library/react'
import { aNewStore } from '~/store'
import { aMinedSafe } from '~/test/builder/safe.redux.builder'
import { sendTokenTo, getFirstTokenContract, sendEtherTo } from '~/test/utils/tokenMovements'
import { EXPAND_BALANCE_INDEX, renderSafeView } from '~/test/builder/safe.dom.utils'
import { getWeb3, getBalanceInEtherOf } from '~/logic/wallets/getWeb3'
import { sendMoveTokensForm, dispatchTknBalance } from '~/test/utils/transactions/moveTokens.helper'
import { sleep } from '~/utils/timer'
import { ETH_ADDRESS } from '~/logic/tokens/utils/tokenHelpers'
import { calculateBalanceOf } from '~/routes/safe/store/actions/fetchTokenBalances'
import 'jest-dom/extend-expect'

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
    await sleep(1000)

    // Open send funds modal
    const balanceRows = SafeDom.getAllByTestId('balance-row')
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
    const safeFunds = await calculateBalanceOf(ETH_ADDRESS, safeAddress, 18)
    expect(Number(safeFunds)).toBe(0)

    const receiverFunds = await getBalanceInEtherOf(accounts[0])
    const ESTIMATED_GASCOSTS = 0.1
    expect(Number(parseInt(receiverFunds, 10) - parseInt(balanceAfterSendingEthToSafe, 10))).toBeGreaterThan(
      parseInt(ethAmount, 10) - ESTIMATED_GASCOSTS,
    )
  })

  it('Sends Tokens with threshold = 1', async () => {
    // GIVEN
    const numTokens = '100'
    const tokenAddress = await sendTokenTo(safeAddress, numTokens)

    await dispatchTknBalance(store, tokenAddress, safeAddress)
    // const StandardToken = await fetchBalancesAction.getStandardTokenContract()
    // const myToken = await StandardToken.at(tokenAddress)
    // console.log(await myToken.allowance(safeAddress, accounts[2]))
    // console.log(await myToken.balanceOf(safeAddress))

    // WHEN
    const SafeDom = await renderSafeView(store, safeAddress)
    await sleep(800)
    // $FlowFixMe
    const buttons = TestUtils.scryRenderedDOMComponentsWithTag(SafeDom, 'button')
    const expandBalance = buttons[EXPAND_BALANCE_INDEX]
    const receiver = accounts[2]
    await sendMoveTokensForm(SafeDom, expandBalance, 20, accounts[2])

    // THEN
    const safeFunds = await fetchBalancesAction.calculateBalanceOf(tokenAddress, safeAddress, 18)
    expect(Number(safeFunds)).toBe(80)
    const receiverFunds = await fetchBalancesAction.calculateBalanceOf(tokenAddress, receiver, 18)
    expect(Number(receiverFunds)).toBe(20)

    const token = await getFirstTokenContract(getWeb3(), accounts[0])
    const nativeSafeFunds = await token.balanceOf(safeAddress)
    expect(Number(nativeSafeFunds.valueOf())).toEqual(80 * 10 ** 18)
  })
})
