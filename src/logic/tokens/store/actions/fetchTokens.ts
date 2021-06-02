import StandardToken from '@gnosis.pm/util-contracts/build/contracts/GnosisStandardToken.json'
import HumanFriendlyToken from '@gnosis.pm/util-contracts/build/contracts/HumanFriendlyToken.json'
import ERC721 from '@openzeppelin/contracts/build/contracts/ERC721.json'
import { List } from 'immutable'
import contract from '@truffle/contract/index.js'
import { addTokens } from 'src/logic/tokens/store/actions/addTokens'
import { fetchErc20AndErc721AssetsList } from 'src/logic/tokens/api'
import { makeToken } from 'src/logic/tokens/store/model/token'
import { tokensSelector } from 'src/logic/tokens/store/selectors'
import { getWeb3 } from 'src/logic/wallets/getWeb3'
import { AppReduxState } from 'src/store'
import { ensureOnce } from 'src/utils/singleton'
import { ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux'
import { Errors, logError } from 'src/logic/exceptions/CodedException'
import { TokenResult } from '../../api/fetchErc20AndErc721AssetsList'

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

export const fetchTokens = () => async (
  dispatch: ThunkDispatch<AppReduxState, undefined, AnyAction>,
  getState: () => AppReduxState,
): Promise<void> => {
  const currentSavedTokens = tokensSelector(getState())

  let tokenList: TokenResult[]
  try {
    const resp = await fetchErc20AndErc721AssetsList()
    tokenList = resp.data.results
  } catch (e) {
    logError(Errors._600, e.message, undefined, false)
    return
  }

  const erc20Tokens = tokenList.filter((token) => token.type.toLowerCase() === 'erc20')

  if (currentSavedTokens?.size === erc20Tokens.length) {
    return
  }

  const tokens = List(erc20Tokens.map((token) => makeToken(token)))

  dispatch(addTokens(tokens))
}
