// @flow
import { getWeb3 } from '~/logic/wallets/getWeb3'
import { type Match } from 'react-router-dom'
import { getFirstTokenContract, getSecondTokenContract } from '~/test/utils/tokenMovements'
import { aNewStore } from '~/store'
import { aMinedSafe } from '~/test/builder/safe.redux.builder'
import { travelToSafe } from '~/test/builder/safe.dom.utils'
import { buildMathPropsFrom } from '~/test/utils/buildReactRouterProps'
import { testToken } from '~/test/builder/tokens.dom.utils'
import * as fetchTokensModule from '~/logic/tokens/store/actions/fetchTokens'
import * as enhancedFetchModule from '~/utils/fetch'
import addToken from '~/logic/tokens/store/actions/addToken'
import { activeTokensSelector, tokenListSelector } from '~/logic/tokens/store/selectors'
import removeTokenAction from '~/logic/tokens/store/actions/removeToken'
import { makeToken } from '~/logic/tokens/store/model/token'

describe('DOM > Feature > Add new ERC 20 Tokens', () => {
  // let web3
  // let accounts
  // let firstErc20Token
  // let secondErc20Token
  // beforeAll(async () => {
  //   web3 = getWeb3()
  //   accounts = await web3.eth.getAccounts()
  //   firstErc20Token = await getFirstTokenContract(web3, accounts[0])
  //   secondErc20Token = await getSecondTokenContract(web3, accounts[0])
  //   // $FlowFixMe
  //   enhancedFetchModule.enhancedFetch = jest.fn()
  //   enhancedFetchModule.enhancedFetch.mockImplementation(() => Promise.resolve({
  //     results: [
  //       {
  //         address: firstErc20Token.address,
  //         name: 'First Token Example',
  //         symbol: 'FTE',
  //         decimals: 18,
  //         logoUri: 'https://upload.wikimedia.org/wikipedia/commons/c/c0/Earth_simple_icon.png',
  //       },
  //     ],
  //   }))
  // })
  // const checkTokensOf = (store: Store, safeAddress: string) => {
  //   const match: Match = buildMathPropsFrom(safeAddress)
  //   const activeTokenList = activeTokensSelector(store.getState(), { match })
  //   expect(activeTokenList.count()).toBe(1)
  //   testToken(activeTokenList.get(0), 'ETH', true)
  //   const tokenList = tokenListSelector(store.getState(), { match })
  //   expect(tokenList.count()).toBe(2)
  //   testToken(tokenList.get(0), 'FTE', false)
  //   testToken(tokenList.get(1), 'ETH', true)
  // }
  // it('removes custom ERC 20 including page reload', async () => {
  //   // GIVEN
  //   const store = aNewStore()
  //   const safeAddress = await aMinedSafe(store)
  //   await store.dispatch(fetchTokensModule.fetchTokens(safeAddress))
  //   const values = {
  //     [TOKEN_ADRESS_PARAM]: secondErc20Token.address,
  //     [TOKEN_NAME_PARAM]: 'Custom ERC20 Token',
  //     [TOKEN_SYMBOL_PARAM]: 'CTS',
  //     [TOKEN_DECIMALS_PARAM]: '10',
  //     [TOKEN_LOGO_URL_PARAM]: 'https://example.com',
  //   }
  //   const customAddTokensFn: any = (...args) => store.dispatch(addToken(...args))
  //   await addTokenFnc(values, customAddTokensFn, safeAddress)
  //   const token = makeToken({
  //     address: secondErc20Token.address,
  //     name: 'Custom ERC20 Token',
  //     symbol: 'CTS',
  //     decimals: 10,
  //     logoUri: 'https://example.com',
  //     status: true,
  //     removable: true,
  //   })
  //   const customRemoveTokensFnc: any = (...args) => store.dispatch(removeTokenAction(...args))
  //   await removeToken(safeAddress, token, customRemoveTokensFnc)
  //   checkTokensOf(store, safeAddress)
  //   // WHEN
  //   const reloadedStore = aNewStore()
  //   await reloadedStore.dispatch(fetchTokensModule.fetchTokens(safeAddress))
  //   travelToSafe(reloadedStore, safeAddress) // reload
  //   // THEN
  //   checkTokensOf(reloadedStore, safeAddress)
  // })
})
