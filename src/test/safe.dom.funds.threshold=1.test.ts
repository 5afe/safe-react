// 
import { fireEvent } from '@testing-library/react'
import { Map, Set, List } from 'immutable'
import { aNewStore } from 'src/store'
import { aMinedSafe } from 'src/test/builder/safe.redux.builder'
import { sendTokenTo, sendEtherTo, get6DecimalsTokenContract } from 'src/test/utils/tokenMovements'
import { renderSafeView } from 'src/test/builder/safe.dom.utils'
import { getWeb3, getBalanceInEtherOf } from 'src/logic/wallets/getWeb3'
import { dispatchAddTokenToList } from 'src/test/utils/transactions/moveTokens.helper'
import { sleep } from 'src/utils/timer'
import saveTokens from 'src/logic/tokens/store/actions/saveTokens'
// import { calculateBalanceOf } from 'src/routes/safe/store/actions/fetchTokenBalances'
import updateActiveTokens from 'src/routes/safe/store/actions/updateActiveTokens'
import '@testing-library/jest-dom/extend-expect'
import updateSafe from 'src/routes/safe/store/actions/updateSafe'
import { makeToken } from 'src/logic/tokens/store/model/token'
import { checkRegisteredTxSend, fillAndSubmitSendFundsForm } from './utils/transactions'
import { BALANCE_ROW_TEST_ID } from 'src/routes/safe/components/Balances'

describe('DOM > Feature > Sending Funds', () => {
  let store
  let safeAddress
  let accounts
  beforeEach(async () => {
    store = aNewStore()
    safeAddress = await aMinedSafe(store)
    accounts = await getWeb3().eth.getAccounts()
  })

  // it('Sends ETH with threshold = 1', async () => {
  //   // GIVEN
  //   const ethAmount = '5'

  //   // the tests are run in parallel, lets use account 9 because it's not used anywhere else
  //   // (in other tests we trigger transactions and pay gas for it, so we can't really make reliable
  //   // assumptions on account's ETH balance)
  //   await sendEtherTo(safeAddress, ethAmount, 9)

  //   // WHEN
  //   const SafeDom = renderSafeView(store, safeAddress)
  //   await sleep(1300)

  //   // Open send funds modal
  //   const balanceRows = SafeDom.getAllByTestId(BALANCE_ROW_TEST_ID)
  //   expect(balanceRows[0]).toHaveTextContent(`${ethAmount} ETH`)
  //   const sendButton = SafeDom.getByTestId('balance-send-btn')
  //   fireEvent.click(sendButton)

  //   const receiverBalanceBeforeTx = await getBalanceInEtherOf(accounts[9])
  //   await fillAndSubmitSendFundsForm(SafeDom, sendButton, ethAmount, accounts[9])

  //   // THEN
  //   const safeFunds = await getBalanceInEtherOf(safeAddress)
  //   expect(Number(safeFunds)).toBe(0)
  //   const receiverBalanceAfterTx = await getBalanceInEtherOf(accounts[9])

  //   const ESTIMATED_GASCOSTS = 0.3
  //   expect(Number(parseInt(receiverBalanceAfterTx, 10) - parseInt(receiverBalanceBeforeTx, 10))).toBeGreaterThan(
  //     parseInt(ethAmount, 10) - ESTIMATED_GASCOSTS,
  //   )

  //   // Check that the transaction was registered
  //   await checkRegisteredTxSend(SafeDom, ethAmount, 'ETH', accounts[9])
  // })

  // it('Sends Tokens with 18 decimals with threshold = 1', async () => {
  //   // GIVEN
  //   const tokensAmount = '100'
  //   const tokenReceiver = accounts[1]
  //   const tokenAddress = await sendTokenTo(safeAddress, tokensAmount)
  //   await dispatchAddTokenToList(store, tokenAddress)

  //   // WHEN
  //   const SafeDom = await renderSafeView(store, safeAddress)
  //   await sleep(1300)

  //   // Activate token
  //   // const safeTokenBalance = await calculateBalanceOf(tokenAddress, safeAddress, 18)
  //   // expect(safeTokenBalance).toBe(tokensAmount)

  //   // const balances = Map({
  //   //   [tokenAddress]: safeTokenBalance,
  //   // })

  //   store.dispatch(updateActiveTokens(safeAddress, Set([tokenAddress])))
  //   store.dispatch(updateSafe({ address: safeAddress, balances }))
  //   await sleep(1000)

  //   // Open send funds modal
  //   const balanceRows = SafeDom.getAllByTestId(BALANCE_ROW_TEST_ID)
  //   expect(balanceRows.length).toBe(2)
  //   const sendButtons = SafeDom.getAllByTestId('balance-send-btn')
  //   expect(sendButtons.length).toBe(2)

  //   await fillAndSubmitSendFundsForm(SafeDom, sendButtons[1], tokensAmount, tokenReceiver)

  //   // THEN
  //   // const safeFunds = await calculateBalanceOf(tokenAddress, safeAddress, 18)
  //   // expect(Number(safeFunds)).toBe(0)
  //   // const receiverFunds = await calculateBalanceOf(tokenAddress, tokenReceiver, 18)
  //   // expect(receiverFunds).toBe(tokensAmount)

  //   // Check that the transaction was registered
  //   await checkRegisteredTxSend(SafeDom, tokensAmount, 'OMG', tokenReceiver)
  // })

  // it('Sends Tokens with decimals other than 18 with threshold = 1', async () => {
  //   // GIVEN
  //   const tokensAmount = '1000000'
  //   const tokenReceiver = accounts[1]
  //   const web3 = await getWeb3()
  //   const SixDecimalsToken = await get6DecimalsTokenContract(web3, accounts[0])
  //   const tokenList = List([
  //     makeToken({
  //       address: SixDecimalsToken.address,
  //       name: '6 Decimals',
  //       symbol: '6DEC',
  //       decimals: 6,
  //       logoUri: 'https://upload.wikimedia.org/wikipedia/commons/c/c0/Earth_simple_icon.png',
  //     }),
  //   ])
  //   await store.dispatch(saveTokens(tokenList))

  //   await SixDecimalsToken.contract.methods.transfer(safeAddress, tokensAmount).send({ from: accounts[0] })

  //   // WHEN
  //   const SafeDom = await renderSafeView(store, safeAddress)
  //   await sleep(1300)

  //   // Activate token
  //   const safeTokenBalance = await calculateBalanceOf(SixDecimalsToken.address, safeAddress, 6)
  //   expect(safeTokenBalance).toBe('1')

  //   const balances = Map({
  //     [SixDecimalsToken.address]: safeTokenBalance,
  //   })

  //   store.dispatch(updateActiveTokens(safeAddress, Set([SixDecimalsToken.address])))
  //   store.dispatch(updateSafe({ address: safeAddress, balances }))
  //   await sleep(1000)

  //   // Open send funds modal
  //   const balanceRows = SafeDom.getAllByTestId(BALANCE_ROW_TEST_ID)
  //   expect(balanceRows.length).toBe(2)
  //   const sendButtons = SafeDom.getAllByTestId('balance-send-btn')
  //   expect(sendButtons.length).toBe(2)

  //   await fillAndSubmitSendFundsForm(SafeDom, sendButtons[1], '1', tokenReceiver)

  //   // THEN
  //   const safeFunds = await calculateBalanceOf(SixDecimalsToken.address, safeAddress, 6)
  //   expect(Number(safeFunds)).toBe(0)
  //   const receiverFunds = await calculateBalanceOf(SixDecimalsToken.address, tokenReceiver, 6)
  //   expect(receiverFunds).toBe('1')
  // })
})
