import StandardToken from '@gnosis.pm/util-contracts/build/contracts/GnosisStandardToken.json'
import HumanFriendlyToken from '@gnosis.pm/util-contracts/build/contracts/HumanFriendlyToken.json'
import ERC20Detailed from '@openzeppelin/contracts/build/contracts/ERC20Detailed.json'
import ERC721 from '@openzeppelin/contracts/build/contracts/ERC721.json'
import { List } from 'immutable'
import contract from 'truffle-contract'

import saveTokens from './saveTokens'

import generateBatchRequests from 'src/logic/contracts/generateBatchRequests'
import { fetchToken, fetchTokenList } from 'src/logic/tokens/api'
import { makeToken, Token } from 'src/logic/tokens/store/model/token'
import { tokensSelector } from 'src/logic/tokens/store/selectors'
import { getWeb3 } from 'src/logic/wallets/getWeb3'
import { store } from 'src/store'
import { ensureOnce } from 'src/utils/singleton'
import { ETH_ADDRESS } from '../../utils/tokenHelpers'
import logo from '../../../../assets/icons/icon_etherTokens.svg'

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

export const containsMethodByHash = async (contractAddress, methodHash) => {
  const web3 = getWeb3()
  const byteCode = await web3.eth.getCode(contractAddress)

  return byteCode.indexOf(methodHash.replace('0x', '')) !== -1
}

const getTokenValues = (tokenAddress) =>
  generateBatchRequests({
    abi: ERC20Detailed.abi,
    address: tokenAddress,
    methods: ['decimals', 'name', 'symbol'],
  })

export const getTokenInfos = async (tokenAddress: string): Promise<Token> => {
  if (!tokenAddress) {
    return null
  }

  if (tokenAddress === ETH_ADDRESS) {
    return makeToken({
      address: ETH_ADDRESS,
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
      logoUri: logo,
    })
  }

  const { tokens } = store.getState()
  const localToken = tokens.get(tokenAddress)

  // If the token is inside the store we return the store token
  if (localToken) {
    return localToken
  }

  // We try to fetch it from the backend
  const remoteToken = await fetchToken(tokenAddress)
  let token = null

  if (remoteToken) {
    const { address, decimals, symbol, logoUri, name } = remoteToken

    if (decimals === null) {
      return null
    }

    token = makeToken({
      address,
      name: name ? name : symbol,
      symbol: symbol,
      decimals: Number(decimals),
      logoUri,
    })
  } else {
    // In case it doesn't exists on the backend, we try to fetch it from the blockchain
    const [tokenDecimals, tokenName, tokenSymbol] = await getTokenValues(tokenAddress)
    if (tokenDecimals === null) {
      return null
    }

    token = makeToken({
      address: tokenAddress,
      name: tokenName ? tokenName : tokenSymbol,
      symbol: tokenSymbol,
      decimals: Number(tokenDecimals),
      logoUri: '',
    })
  }

  const newTokens = tokens.set(tokenAddress, token)
  store.dispatch(saveTokens(newTokens))

  return token
}

export const fetchTokens = () => async (dispatch, getState) => {
  try {
    const currentSavedTokens = tokensSelector(getState())

    const {
      data: { results: tokenList },
    } = await fetchTokenList()

    if (currentSavedTokens && currentSavedTokens.size === tokenList.length) {
      return
    }

    const tokens = List(tokenList.map((token) => makeToken(token)))

    dispatch(saveTokens(tokens))
  } catch (err) {
    console.error('Error fetching token list', err)
  }
}

export default fetchTokens
