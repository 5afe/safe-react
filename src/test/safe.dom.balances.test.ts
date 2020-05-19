// 
import { waitForElement } from '@testing-library/react'
import { Set, Map } from 'immutable'
import { aNewStore } from 'src/store'
import { sleep } from 'src/utils/timer'
import { aMinedSafe } from 'src/test/builder/safe.redux.builder'
import { sendTokenTo, sendEtherTo } from 'src/test/utils/tokenMovements'
import { renderSafeView } from 'src/test/builder/safe.dom.utils'
import { dispatchAddTokenToList } from 'src/test/utils/transactions/moveTokens.helper'
// import { calculateBalanceOf } from 'src/routes/safe/store/actions/fetchTokenBalances'
import updateActiveTokens from 'src/routes/safe/store/actions/updateActiveTokens'
import '@testing-library/jest-dom/extend-expect'
import updateSafe from 'src/routes/safe/store/actions/updateSafe'
import { BALANCE_ROW_TEST_ID } from 'src/routes/safe/components/Balances'
import { getBalanceInEtherOf } from 'src/logic/wallets/getWeb3'

describe('DOM > Feature > Balances', () => {
  let store
  let safeAddress
  beforeEach(async () => {
    store = aNewStore()
    safeAddress = await aMinedSafe(store)
  })

  it('Updates token balances automatically', async () => {
    const tokensAmount = '100'
    const tokenAddress = await sendTokenTo(safeAddress, tokensAmount)
    await dispatchAddTokenToList(store, tokenAddress)

    const SafeDom = await renderSafeView(store, safeAddress)

    // Activate token
    const safeTokenBalance = undefined
    // const safeTokenBalance = await calculateBalanceOf(tokenAddress, safeAddress, 18)
    // expect(safeTokenBalance).toBe(tokensAmount)

    const balances = Map({
      [tokenAddress]: safeTokenBalance,
    })
    store.dispatch(updateActiveTokens(safeAddress, Set([tokenAddress])))
    store.dispatch(updateSafe({ address: safeAddress, balances }))
    await sleep(1000)

    const balanceRows = SafeDom.getAllByTestId(BALANCE_ROW_TEST_ID)
    expect(balanceRows.length).toBe(2)

    await waitForElement(() => SafeDom.getByText(`${tokensAmount} OMG`))

    await sendTokenTo(safeAddress, tokensAmount)

    await waitForElement(() => SafeDom.getByText(`${parseInt(tokensAmount, 10) * 2} OMG`))
  })

  it('Updates ether balance automatically', async () => {
    const etherAmount = '1'
    await sendEtherTo(safeAddress, etherAmount)

    const SafeDom = await renderSafeView(store, safeAddress)

    const safeEthBalance = await getBalanceInEtherOf(safeAddress)
    expect(safeEthBalance).toBe(etherAmount)

    const balanceRows = SafeDom.getAllByTestId(BALANCE_ROW_TEST_ID)
    expect(balanceRows.length).toBe(1)

    await waitForElement(() => SafeDom.getByText(`${etherAmount} ETH`))

    await sendEtherTo(safeAddress, etherAmount)

    await waitForElement(() => SafeDom.getByText(`${parseInt(etherAmount, 10) * 2} ETH`))
  })
})
