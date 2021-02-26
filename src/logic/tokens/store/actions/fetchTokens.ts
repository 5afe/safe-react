import StandardToken from '@gnosis.pm/util-contracts/build/contracts/GnosisStandardToken.json'
import HumanFriendlyToken from '@gnosis.pm/util-contracts/build/contracts/HumanFriendlyToken.json'
import ERC20Detailed from '@openzeppelin/contracts/build/contracts/ERC20Detailed.json'
import ERC721 from '@openzeppelin/contracts/build/contracts/ERC721.json'
import { List } from 'immutable'
import contract from '@truffle/contract/index.js'
import { AbiItem } from 'web3-utils'

import saveTokens from './saveTokens'

import generateBatchRequests from 'src/logic/contracts/generateBatchRequests'
import { fetchErc20AndErc721AssetsList } from 'src/logic/tokens/api'
import { makeToken, Token } from 'src/logic/tokens/store/model/token'
import { tokensSelector } from 'src/logic/tokens/store/selectors'
import { getWeb3 } from 'src/logic/wallets/getWeb3'
import { AppReduxState, store } from 'src/store'
import { ensureOnce } from 'src/utils/singleton'
import { ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux'

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

export const containsMethodByHash = async (contractAddress: string, methodHash: string): Promise<boolean> => {
  const web3 = getWeb3()
  const byteCode = await web3.eth.getCode(contractAddress)

  return byteCode.indexOf(methodHash.replace('0x', '')) !== -1
}

const getTokenValues = (tokenAddress) =>
  generateBatchRequests<[undefined, string | undefined, string | undefined, string | undefined]>({
    abi: ERC20Detailed.abi as AbiItem[],
    address: tokenAddress,
    methods: ['decimals', 'name', 'symbol'],
  })

export const getTokenInfos = async (tokenAddress: string): Promise<Token | undefined> => {
  const { tokens } = store.getState()
  const localToken = tokens.get(tokenAddress)

  // If the token is inside the store we return the store token
  if (localToken) {
    return localToken
  }

  // Otherwise we fetch it, save it to the store and return it
  const [, tokenDecimals, tokenName, tokenSymbol] = await getTokenValues(tokenAddress)

  if (tokenDecimals === null) {
    return undefined
  }

  const token = makeToken({
    address: tokenAddress,
    name: tokenName ? tokenName : tokenSymbol,
    symbol: tokenSymbol,
    decimals: Number(tokenDecimals),
    logoUri: '',
  })

  const newTokens = tokens.set(tokenAddress, token)
  store.dispatch(saveTokens(newTokens))

  return token
}

export const fetchTokens = () => async (
  dispatch: ThunkDispatch<AppReduxState, undefined, AnyAction>,
  getState: () => AppReduxState,
): Promise<void> => {
  try {
    const currentSavedTokens = tokensSelector(getState())

    const {
      data: { results: tokenList },
    } = await fetchErc20AndErc721AssetsList()

    const erc20Tokens = tokenList.filter((token) => token.type.toLowerCase() === 'erc20')

    if (currentSavedTokens?.size === erc20Tokens.length) {
      return
    }

    const tokens = List(erc20Tokens.map((token) => makeToken(token)))

    dispatch(saveTokens(tokens))
  } catch (err) {
    console.error('Error fetching token list', err)
  }
}

export default fetchTokens
