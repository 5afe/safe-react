// import { fireEvent } from '@testing-library/react'
// import { getWeb3 } from 'src/logic/wallets/getWeb3'
// import { getFirstTokenContract } from 'src/test/utils/tokenMovements'
// import { aNewStore } from 'src/store'
// import { aMinedSafe } from 'src/test/builder/safe.redux.builder'
// import { renderSafeView } from 'src/test/builder/safe.dom.utils'
// import { sleep } from 'src/utils/timer'
// import { clickOnManageTokens, clickOnAddCustomToken } from 'src/test/utils/DOMNavigation'
// import * as fetchTokensModule from 'src/logic/tokens/store/actions/fetchTokens'
// import {
//   ADD_CUSTOM_TOKEN_ADDRESS_INPUT_TEST_ID,
//   ADD_CUSTOM_TOKEN_SYMBOLS_INPUT_TEST_ID,
//   ADD_CUSTOM_TOKEN_DECIMALS_INPUT_TEST_ID,
//   ADD_CUSTOM_TOKEN_FORM,
// } from 'src/routes/safe/components/Balances/Tokens/screens/AddCustomToken'
// import { BALANCE_ROW_TEST_ID } from 'src/routes/safe/components/Balances/'
// import '@testing-library/jest-dom/extend-expect'
export const TODO = 'TODO'
// // https://github.com/testing-library/@testing-library/react/issues/281
// const originalError = console.error
// beforeAll(() => {
//   console.error = (...args) => {
//     if (/Warning.*not wrapped in act/.test(args[0])) {
//       return
//     }
//     originalError.call(console, ...args)
//   }
// })

// afterAll(() => {
//   console.error = originalError
// })

// describe('DOM > Feature > Add custom ERC 20 Tokens', () => {
//   let web3
//   let accounts
//   let erc20Token

//   beforeAll(async () => {
//     web3 = getWeb3()
//     accounts = await web3.eth.getAccounts()
//     erc20Token = await getFirstTokenContract(web3, accounts[0])
//   })

//   it('adds and displays an erc 20 token after filling the form', async () => {
//     // GIVEN
//     const store = aNewStore()
//     const safeAddress = await aMinedSafe(store)
//     await store.dispatch(fetchTokensModule.fetchTokens() as any)
//     const TokensDom = renderSafeView(store, safeAddress)
//     await sleep(400)

//     // WHEN
//     clickOnManageTokens(TokensDom)
//     clickOnAddCustomToken(TokensDom)
//     await sleep(200)

//     // Fill address
//     const addTokenForm = TokensDom.getByTestId(ADD_CUSTOM_TOKEN_FORM)
//     const addressInput = TokensDom.getByTestId(ADD_CUSTOM_TOKEN_ADDRESS_INPUT_TEST_ID)
//     fireEvent.change(addressInput, { target: { value: erc20Token.address } })
//     await sleep(500)

//     // Check if it loaded symbol/decimals correctly
//     const symbolInput: any = TokensDom.getByTestId(ADD_CUSTOM_TOKEN_SYMBOLS_INPUT_TEST_ID)
//     const decimalsInput: any = TokensDom.getByTestId(ADD_CUSTOM_TOKEN_DECIMALS_INPUT_TEST_ID)

//     const tokenSymbol = await erc20Token.symbol()
//     const tokenDecimals = await erc20Token.decimals()
//     expect(symbolInput.value).toBe(tokenSymbol)
//     expect(decimalsInput.value).toBe(tokenDecimals.toString())

//     // Submit form
//     fireEvent.submit(addTokenForm)
//     await sleep(300)

//     // check if token is displayed
//     const balanceRows = TokensDom.getAllByTestId(BALANCE_ROW_TEST_ID)
//     expect(balanceRows.length).toBe(2)
//     expect(balanceRows[1]).toHaveTextContent(tokenSymbol)
//   })
// })
