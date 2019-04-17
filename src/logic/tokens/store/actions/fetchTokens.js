// @flow
import { Map } from 'immutable'
import contract from 'truffle-contract'
import axios from 'axios'
import type { Dispatch as ReduxDispatch } from 'redux'
import StandardToken from '@gnosis.pm/util-contracts/build/contracts/GnosisStandardToken.json'
import HumanFriendlyToken from '@gnosis.pm/util-contracts/build/contracts/HumanFriendlyToken.json'
import { getWeb3 } from '~/logic/wallets/getWeb3'
import { type GlobalState } from '~/store/index'
import { makeToken, type Token, type TokenProps } from '~/logic/tokens/store/model/token'
import { ensureOnce } from '~/utils/singleton'
import saveTokens from './saveTokens'
import { getRelayUrl } from '~/config/index'

const createStandardTokenContract = async () => {
  const web3 = getWeb3()
  const erc20Token = await contract(StandardToken)
  erc20Token.setProvider(web3.currentProvider)

  return erc20Token
}
const createHumanFriendlyTokenContract = async () => {
  const web3 = getWeb3()
  const humanErc20Token = await contract(HumanFriendlyToken)
  humanErc20Token.setProvider(web3.currentProvider)

  return humanErc20Token
}

export const getHumanFriendlyToken = ensureOnce(createHumanFriendlyTokenContract)

export const getStandardTokenContract = ensureOnce(createStandardTokenContract)

const fetchTokenList = async () => {
  const apiUrl = getRelayUrl()
  const url = `${apiUrl}/tokens`
  const errMsg = 'Error querying safe balances'
  return axios.get(url, errMsg)
}

export const fetchTokens = () => async (dispatch: ReduxDispatch<GlobalState>) => {
  try {
    const {
      data: { results: tokenList },
    } = await fetchTokenList()

    const tokensMap: Map<string, Token> = Map().withMutations((map) => {
      tokenList.forEach((token: TokenProps) => map.set(token.address, makeToken(token)))
    })

    dispatch(saveTokens(tokensMap))
  } catch (err) {
    // eslint-disable-next-line
    console.log('Error fetching token list ' + err)

    return Promise.resolve()
  }
}

export default fetchTokens
