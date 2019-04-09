// @flow
import { List, Map } from 'immutable'
import contract from 'truffle-contract'
import axios from 'axios'
import type { Dispatch as ReduxDispatch } from 'redux'
import StandardToken from '@gnosis.pm/util-contracts/build/contracts/GnosisStandardToken.json'
import HumanFriendlyToken from '@gnosis.pm/util-contracts/build/contracts/HumanFriendlyToken.json'
import { getWeb3 } from '~/logic/wallets/getWeb3'
import { type GlobalState } from '~/store/index'
import { makeToken, type Token, type TokenProps } from '~/logic/tokens/store/model/token'
import { ensureOnce } from '~/utils/singleton'
import { getActiveTokens, getTokens } from '~/logic/tokens/utils/tokensStorage'
import { getEthAsToken } from '~/logic/tokens/utils/tokenHelpers'
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

export const fetchTokensData = async () => {
  const apiUrl = getRelayUrl()
  const url = `${apiUrl}/tokens`
  const errMsg = 'Error querying safe balances'
  return axios.get(url, errMsg)
}

export const fetchTokens = (safeAddress: string) => async (dispatch: ReduxDispatch<GlobalState>) => {
  const tokens: List<TokenProps> = await getActiveTokens(safeAddress)
  const ethBalance = await getEthAsToken(safeAddress)
  const customTokens = await getTokens(safeAddress)
  const {
    data: { results },
  } = await fetchTokensData()

  try {
    const balancesRecords = await Promise.all(
      results.map(async (item: TokenProps) => {
        const status = tokens.findIndex(activeToken => activeToken.name === item.name) !== -1
        const funds = status ? await calculateBalanceOf(item.address, safeAddress, item.decimals) : '0'

        return makeToken({ ...item, status, funds })
      }),
    )

    const customTokenRecords = await Promise.all(
      customTokens.map(async (item: TokenProps) => {
        const status = tokens.findIndex(activeToken => activeToken.name === item.name) !== -1
        const funds = status ? await calculateBalanceOf(item.address, safeAddress, item.decimals) : '0'

        return makeToken({ ...item, status, funds })
      }),
    )

    const balances: Map<string, Token> = Map().withMutations((map) => {
      balancesRecords.forEach(record => map.set(record.address, record))
      customTokenRecords.forEach(record => map.set(record.address, record))

      map.set(ethBalance.address, ethBalance)
    })

    return dispatch(saveTokens(safeAddress, balances))
  } catch (err) {
    // eslint-disable-next-line
    console.log('Error fetching tokens... ' + err)

    return Promise.resolve()
  }
}
