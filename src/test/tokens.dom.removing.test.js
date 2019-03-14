// @flow
import * as TestUtils from 'react-dom/test-utils'
import { getWeb3 } from '~/logic/wallets/getWeb3'
import { getFirstTokenContract, getSecondTokenContract } from '~/test/utils/tokenMovements'
import { aNewStore } from '~/store'
import { aMinedSafe } from '~/test/builder/safe.redux.builder'
import { travelToTokens } from '~/test/builder/safe.dom.utils'
import * as fetchTokensModule from '~/routes/tokens/store/actions/fetchTokens'
import * as enhancedFetchModule from '~/utils/fetch'
import { TOKEN_ADRESS_PARAM } from '~/routes/tokens/component/AddToken/FirstPage'
import { TOKEN_NAME_PARAM, TOKEN_SYMBOL_PARAM, TOKEN_DECIMALS_PARAM, TOKEN_LOGO_URL_PARAM } from '~/routes/tokens/component/AddToken/SecondPage'
import addToken from '~/routes/tokens/store/actions/addToken'
import { addTokenFnc } from '~/routes/tokens/component/AddToken'
import { sleep } from '~/utils/timer'
import TokenComponent from '~/routes/tokens/component/Token'
import { testToken } from '~/test/builder/tokens.dom.utils'

describe('DOM > Feature > Add new ERC 20 Tokens', () => {
  let web3
  let accounts
  let firstErc20Token
  let secondErc20Token

  beforeAll(async () => {
    web3 = getWeb3()
    accounts = await web3.eth.getAccounts()
    firstErc20Token = await getFirstTokenContract(web3, accounts[0])
    secondErc20Token = await getSecondTokenContract(web3, accounts[0])

    // $FlowFixMe
    enhancedFetchModule.enhancedFetch = jest.fn()
    enhancedFetchModule.enhancedFetch.mockImplementation(() => Promise.resolve([
      {
        address: firstErc20Token.address,
        name: 'First Token Example',
        symbol: 'FTE',
        decimals: 18,
        logoUri: 'https://upload.wikimedia.org/wikipedia/commons/c/c0/Earth_simple_icon.png',
      },
    ]))
  })

  it('remove custom ERC 20 tokens', async () => {
    // GIVEN
    const store = aNewStore()
    const safeAddress = await aMinedSafe(store)
    await store.dispatch(fetchTokensModule.fetchTokens(safeAddress))

    const values = {
      [TOKEN_ADRESS_PARAM]: secondErc20Token.address,
      [TOKEN_NAME_PARAM]: 'Custom ERC20 Token',
      [TOKEN_SYMBOL_PARAM]: 'CTS',
      [TOKEN_DECIMALS_PARAM]: '10',
      [TOKEN_LOGO_URL_PARAM]: 'https://example.com',
    }

    const customAddTokensFn: any = (...args) => store.dispatch(addToken(...args))
    await addTokenFnc(values, customAddTokensFn, safeAddress)
    const TokensDom = travelToTokens(store, safeAddress)
    await sleep(400)

    // WHEN
    const buttons = TestUtils.scryRenderedDOMComponentsWithTag(TokensDom, 'button')
    expect(buttons.length).toBe(2)
    const removeUserButton = buttons[0]
    expect(removeUserButton.getAttribute('aria-label')).toBe('Delete')
    TestUtils.Simulate.click(removeUserButton)
    await sleep(400)

    const form = TestUtils.findRenderedDOMComponentWithTag(TokensDom, 'form')
    // submit it
    TestUtils.Simulate.submit(form)
    TestUtils.Simulate.submit(form)

    await sleep(400)

    const tokens = TestUtils.scryRenderedComponentsWithType(TokensDom, TokenComponent)
    expect(tokens.length).toBe(2)
    testToken(tokens[0].props.token, 'FTE', false)
    testToken(tokens[1].props.token, 'ETH', true)
  })
})
