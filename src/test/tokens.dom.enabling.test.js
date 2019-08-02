// @flow
import { List } from 'immutable'
import Web3Integration from '~/logic/wallets/web3Integration'
import { getFirstTokenContract, getSecondTokenContract } from '~/test/utils/tokenMovements'
import { aNewStore } from '~/store'
import { aMinedSafe } from '~/test/builder/safe.redux.builder'
import { renderSafeView } from '~/test/builder/safe.dom.utils'
import { sleep } from '~/utils/timer'
import saveTokens from '~/logic/tokens/store/actions/saveTokens'
import { clickOnManageTokens, toggleToken, closeManageTokensModal } from './utils/DOMNavigation'
import { BALANCE_ROW_TEST_ID } from '~/routes/safe/components/Balances'
import { makeToken } from '~/logic/tokens/store/model/token'
import '@testing-library/jest-dom/extend-expect'

describe('DOM > Feature > Enable and disable default tokens', () => {
  let web3
  let accounts
  let firstErc20Token
  let secondErc20Token
  let testTokens

  beforeAll(async () => {
    web3 = Web3Integration.web3
    accounts = await web3.eth.getAccounts()

    firstErc20Token = await getFirstTokenContract(web3, accounts[0])
    secondErc20Token = await getSecondTokenContract(web3, accounts[0])
    testTokens = List([
      makeToken({
        address: firstErc20Token.address,
        name: 'First Token Example',
        symbol: 'FTE',
        decimals: 18,
        logoUri: 'https://upload.wikimedia.org/wikipedia/commons/c/c0/Earth_simple_icon.png',
      }),
      makeToken({
        address: secondErc20Token.address,
        name: 'Second Token Example',
        symbol: 'STE',
        decimals: 18,
        logoUri: 'https://upload.wikimedia.org/wikipedia/commons/c/c0/Earth_simple_icon.png',
      }),
    ])
  })

  it('allows to enable and disable tokens', async () => {
    // GIVEN
    const store = aNewStore()
    const safeAddress = await aMinedSafe(store)
    await store.dispatch(saveTokens(testTokens))

    // WHEN
    const TokensDom = await renderSafeView(store, safeAddress)
    await sleep(400)

    // Check if only ETH is enabled
    let balanceRows = TokensDom.getAllByTestId(BALANCE_ROW_TEST_ID)
    expect(balanceRows.length).toBe(1)

    // THEN
    clickOnManageTokens(TokensDom)
    toggleToken(TokensDom, 'FTE')
    toggleToken(TokensDom, 'STE')
    closeManageTokensModal(TokensDom)

    // Check if tokens were enabled
    balanceRows = TokensDom.getAllByTestId(BALANCE_ROW_TEST_ID)
    expect(balanceRows.length).toBe(3)
    expect(balanceRows[1]).toHaveTextContent('FTE')
    expect(balanceRows[2]).toHaveTextContent('STE')

    // disable tokens
    clickOnManageTokens(TokensDom)
    toggleToken(TokensDom, 'FTE')
    toggleToken(TokensDom, 'STE')
    closeManageTokensModal(TokensDom)

    // check if tokens were disabled
    balanceRows = TokensDom.getAllByTestId(BALANCE_ROW_TEST_ID)
    expect(balanceRows.length).toBe(1)
    expect(balanceRows[0]).toHaveTextContent('ETH')
  })
})
