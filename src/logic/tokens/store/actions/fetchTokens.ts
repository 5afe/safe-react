import StandardToken from '@gnosis.pm/util-contracts/build/contracts/GnosisStandardToken.json'
import HumanFriendlyToken from '@gnosis.pm/util-contracts/build/contracts/HumanFriendlyToken.json'
import ERC721 from '@openzeppelin/contracts/build/contracts/ERC721.json'
import { List } from 'immutable'
import contract from 'truffle-contract'

import saveTokens from './saveTokens'

import { makeToken } from 'src/logic/tokens/store/model/token'
import { tokensSelector } from 'src/logic/tokens/store/selectors'
import { fetchTokenList } from 'src/logic/tokens/api'
import { getWeb3 } from 'src/logic/wallets/getWeb3'
import { AppReduxState } from 'src/store'
import { ensureOnce } from 'src/utils/singleton'
import { Dispatch } from 'redux'

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

export const fetchTokens = () => async (dispatch: Dispatch, getState: () => AppReduxState): Promise<void> => {
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
