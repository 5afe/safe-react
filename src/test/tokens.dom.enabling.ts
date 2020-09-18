// import { waitForElement } from '@testing-library/react'
// import { List } from 'immutable'
// import { getWeb3 } from 'src/logic/wallets/getWeb3'
// import { getFirstTokenContract, getSecondTokenContract } from 'src/test/utils/tokenMovements'
// import { aNewStore } from 'src/store'
// import { aMinedSafe } from 'src/test/builder/safe.redux.builder'
// import { renderSafeView } from 'src/test/builder/safe.dom.utils'
// import { sleep } from 'src/utils/timer'
// import saveTokens from 'src/logic/tokens/store/actions/saveTokens'
// import { clickOnManageTokens, closeManageTokensModal, toggleToken } from './utils/DOMNavigation'
// import { BALANCE_ROW_TEST_ID } from 'src/routes/safe/components/Balances'
// import { makeToken } from 'src/logic/tokens/store/model/token'
// import '@testing-library/jest-dom/extend-expect'
// import { getActiveTokens } from 'src/logic/tokens/utils/tokensStorage'
export const TODO = 'TODO'
// describe('DOM > Feature > Enable and disable default tokens', () => {
//   let web3
//   let accounts
//   let firstErc20Token
//   let secondErc20Token
//   let testTokens

//   beforeAll(async () => {
//     web3 = getWeb3()
//     accounts = await web3.eth.getAccounts()

//     firstErc20Token = await getFirstTokenContract(web3, accounts[0])
//     secondErc20Token = await getSecondTokenContract(web3, accounts[0])
//     testTokens = List([
//       makeToken({
//         address: firstErc20Token.address,
//         name: 'First Token Example',
//         symbol: 'FTE',
//         decimals: 18,
//         logoUri: 'https://upload.wikimedia.org/wikipedia/commons/c/c0/Earth_simple_icon.png',
//       }),
//       makeToken({
//         address: secondErc20Token.address,
//         name: 'Second Token Example',
//         symbol: 'STE',
//         decimals: 18,
//         logoUri: 'https://upload.wikimedia.org/wikipedia/commons/c/c0/Earth_simple_icon.png',
//       }),
//     ])
//   })

//   it('allows to enable and disable tokens, stores active ones in the local storage', async () => {
//     // GIVEN
//     const store = aNewStore()
//     const safeAddress = await aMinedSafe(store)
//     await store.dispatch(saveTokens(testTokens))

//     // WHEN
//     const TokensDom = await renderSafeView(store, safeAddress)

//     // Check if only ETH is enabled
//     let balanceRows = await waitForElement(() => TokensDom.getAllByTestId(BALANCE_ROW_TEST_ID))
//     expect(balanceRows.length).toBe(1)

//     // THEN
//     clickOnManageTokens(TokensDom)
//     await toggleToken(TokensDom, 'FTE')
//     await toggleToken(TokensDom, 'STE')
//     closeManageTokensModal(TokensDom)

//     // Wait for active tokens to save
//     await sleep(1500)

//     // Check if tokens were enabled
//     balanceRows = TokensDom.getAllByTestId(BALANCE_ROW_TEST_ID)
//     expect(balanceRows.length).toBe(3)
//     expect(balanceRows[1]).toHaveTextContent('FTE')
//     expect(balanceRows[2]).toHaveTextContent('STE')
//     const tokensFromStorage = await getActiveTokens()

//     expect(Object.keys(tokensFromStorage)).toContain(firstErc20Token.address)
//     expect(Object.keys(tokensFromStorage)).toContain(secondErc20Token.address)

//     // disable tokens
//     clickOnManageTokens(TokensDom)
//     await toggleToken(TokensDom, 'FTE')
//     await toggleToken(TokensDom, 'STE')
//     closeManageTokensModal(TokensDom)
//     await sleep(1500)

//     // check if tokens were disabled
//     balanceRows = TokensDom.getAllByTestId(BALANCE_ROW_TEST_ID)
//     expect(balanceRows.length).toBe(1)
//     expect(balanceRows[0]).toHaveTextContent('ETH')
//   })
// })
