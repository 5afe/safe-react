// @flow
import StandardToken from '@gnosis.pm/util-contracts/build/contracts/GnosisStandardToken.json'
import HumanFriendlyToken from '@gnosis.pm/util-contracts/build/contracts/HumanFriendlyToken.json'
import ERC721 from '@openzeppelin/contracts/build/contracts/ERC721'
import { List } from 'immutable'
import type { Dispatch as ReduxDispatch } from 'redux'
import contract from 'truffle-contract'

import saveTokens from './saveTokens'

import { fetchTokenList } from '~/logic/tokens/api'
import { type TokenProps, makeToken } from '~/logic/tokens/store/model/token'
import { getWeb3 } from '~/logic/wallets/getWeb3'
import { type GlobalState } from '~/store'
import { ensureOnce } from '~/utils/singleton'

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

const createERC721TokenContract = async () => {
  const web3 = getWeb3()
  const erc721Token = await contract(ERC721)
  erc721Token.setProvider(web3.currentProvider)

  return erc721Token
}

export const getHumanFriendlyToken = ensureOnce(createHumanFriendlyTokenContract)

export const getStandardTokenContract = ensureOnce(createStandardTokenContract)

export const getERC721TokenContract = ensureOnce(createERC721TokenContract)

export const containsMethodByHash = async (contractAddress: string, methodHash: string) => {
  const web3 = getWeb3()
  const byteCode = await web3.eth.getCode(contractAddress)

  return byteCode.indexOf(methodHash.replace('0x', '')) !== -1
}

let tokensInstanceCache = {}

export const getTokenInstance = async (tokenAddress: string) => {
  if (!tokenAddress) {
    return null
  }
  let tokenInstance = tokensInstanceCache[tokenAddress]
  // If the token is inside the cache we return the cached token
  if (tokenInstance) {
    return tokenInstance
  }
  // Otherwise we fetch it, save it to the cache and return it
  const tokenContract = await getHumanFriendlyToken()
  tokenInstance = await tokenContract.at(tokenAddress)
  const [tokenSymbol, tokenDecimals] = await Promise.all([tokenInstance.symbol(), tokenInstance.decimals()])
  tokenInstance.symbol = () => tokenSymbol
  tokenInstance.tokenDecimals = () => tokenDecimals
  tokensInstanceCache[tokenAddress] = tokenInstance
  return tokenInstance
}

export const fetchTokens = () => async (dispatch: ReduxDispatch<GlobalState>) => {
  try {
    const {
      data: { results: tokenList },
    } = await fetchTokenList()

    const tokens = List(tokenList.map((token: TokenProps) => makeToken(token)))

    dispatch(saveTokens(tokens))
  } catch (err) {
    console.error('Error fetching token list', err)

    return Promise.resolve()
  }
}

export default fetchTokens
