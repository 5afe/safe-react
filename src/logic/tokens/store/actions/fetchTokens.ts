import ERC20Contract from '@openzeppelin/contracts/build/contracts/ERC20.json'
import ERC721Contract from '@openzeppelin/contracts/build/contracts/ERC721.json'
import { List } from 'immutable'
import { AnyAction } from 'redux'
import { ThunkDispatch } from 'redux-thunk'
import { AbiItem } from 'web3-utils'

import { ERC20 } from 'src/types/contracts/ERC20.d'
import { ERC721 } from 'src/types/contracts/ERC721.d'
import { addTokens } from 'src/logic/tokens/store/actions/addTokens'
import { fetchErc20AndErc721AssetsList } from 'src/logic/tokens/api'
import { makeToken } from 'src/logic/tokens/store/model/token'
import { tokensSelector } from 'src/logic/tokens/store/selectors'
import { getWeb3 } from 'src/logic/wallets/getWeb3'
import { AppReduxState } from 'src/store'
import { Errors, logError } from 'src/logic/exceptions/CodedException'
import { TokenResult } from '../../api/fetchErc20AndErc721AssetsList'

const createERC20TokenContract = (tokenAddress: string): ERC20 => {
  const web3 = getWeb3()
  return new web3.eth.Contract(ERC20Contract.abi as AbiItem[], tokenAddress) as unknown as ERC20
}

const createERC721TokenContract = (tokenAddress: string): ERC721 => {
  const web3 = getWeb3()
  return new web3.eth.Contract(ERC721Contract.abi as AbiItem[], tokenAddress) as unknown as ERC721
}

export const getERC20TokenContract = createERC20TokenContract

export const getERC721TokenContract = createERC721TokenContract

export const containsMethodByHash = async (contractAddress: string, methodHash: string): Promise<boolean> => {
  const web3 = getWeb3()
  const byteCode = await web3.eth.getCode(contractAddress)

  return byteCode.indexOf(methodHash.replace('0x', '')) !== -1
}

export const fetchTokens =
  () =>
  async (
    dispatch: ThunkDispatch<AppReduxState, undefined, AnyAction>,
    getState: () => AppReduxState,
  ): Promise<void> => {
    const currentSavedTokens = tokensSelector(getState())

    let tokenList: TokenResult[]
    try {
      const resp = await fetchErc20AndErc721AssetsList()
      tokenList = resp.data.results
    } catch (e) {
      logError(Errors._600, e.message)
      return
    }

    const erc20Tokens = tokenList.filter((token) => token.type.toLowerCase() === 'erc20')

    if (currentSavedTokens?.size === erc20Tokens.length) {
      return
    }

    const tokens = List(erc20Tokens.map((token) => makeToken(token)))

    dispatch(addTokens(tokens))
  }
