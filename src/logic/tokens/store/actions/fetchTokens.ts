//
import StandardToken from '@gnosis.pm/util-contracts/build/contracts/GnosisStandardToken.json'
import HumanFriendlyToken from '@gnosis.pm/util-contracts/build/contracts/HumanFriendlyToken.json'
import ERC721 from '@openzeppelin/contracts/build/contracts/ERC721'
import { List } from 'immutable'
import contract from 'truffle-contract'

import saveTokens from './saveTokens'

import { fetchTokenList } from 'src/logic/tokens/api'
import { makeToken } from 'src/logic/tokens/store/model/token'
import { tokensSelector } from 'src/logic/tokens/store/selectors'
import { getWeb3 } from 'src/logic/wallets/getWeb3'
import { store } from 'src/store'
import { ensureOnce } from 'src/utils/singleton'

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

// For the `batchRequest` of balances, we're just using the `balanceOf` method call.
// So having a simple ABI only with `balanceOf` prevents errors
// when instantiating non-standard ERC-20 Tokens.
export const OnlyBalanceToken = {
  contractName: 'OnlyBalanceToken',
  abi: [
    {
      constant: true,
      inputs: [
        {
          name: 'owner',
          type: 'address',
        },
      ],
      name: 'balanceOf',
      outputs: [
        {
          name: '',
          type: 'uint256',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [
        {
          name: 'owner',
          type: 'address',
        },
      ],
      name: 'balances',
      outputs: [
        {
          name: '',
          type: 'uint256',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
  ],
}

export const getHumanFriendlyToken = ensureOnce(createHumanFriendlyTokenContract)

export const getStandardTokenContract = ensureOnce(createStandardTokenContract)

export const getERC721TokenContract = ensureOnce(createERC721TokenContract)

export const containsMethodByHash = async (contractAddress, methodHash) => {
  const web3 = getWeb3()
  const byteCode = await web3.eth.getCode(contractAddress)

  return byteCode.indexOf(methodHash.replace('0x', '')) !== -1
}

export const getTokenInfos = async (tokenAddress) => {
  if (!tokenAddress) {
    return null
  }
  const { tokens } = store.getState()
  const localToken = tokens.get(tokenAddress)
  // If the token is inside the store we return the store token
  if (localToken) {
    return localToken
  }
  // Otherwise we fetch it, save it to the store and return it
  const tokenContract = await getHumanFriendlyToken()
  const tokenInstance = await tokenContract.at(tokenAddress)
  const [tokenSymbol, tokenDecimals, name] = await Promise.all([
    tokenInstance.symbol(),
    tokenInstance.decimals(),
    tokenInstance.name(),
  ])
  const savedToken = makeToken({
    address: tokenAddress,
    name: name ? name : tokenSymbol,
    symbol: tokenSymbol,
    decimals: tokenDecimals.toNumber(),
    logoUri: '',
  })
  const newTokens = tokens.set(tokenAddress, savedToken)
  store.dispatch(saveTokens(newTokens))

  return savedToken
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
