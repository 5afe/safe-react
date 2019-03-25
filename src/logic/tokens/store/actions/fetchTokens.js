// @flow
import { List, Map } from 'immutable'
import contract from 'truffle-contract'
import type { Dispatch as ReduxDispatch } from 'redux'
import StandardToken from '@gnosis.pm/util-contracts/build/contracts/GnosisStandardToken.json'
import HumanFriendlyToken from '@gnosis.pm/util-contracts/build/contracts/HumanFriendlyToken.json'
import { getWeb3 } from '~/logic/wallets/getWeb3'
import { type GlobalState } from '~/store/index'
import { makeToken, type Token, type TokenProps } from '~/logic/tokens/store/model/token'
import { ensureOnce } from '~/utils/singleton'
import { getActiveTokenAddresses, getTokens } from '~/logic/tokens/utils/activeTokensStorage'
import { getSafeEthToken } from '~/logic/tokens/utils/tokenHelpers'
import { enhancedFetch } from '~/utils/fetch'
import addTokens from './addTokens'
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

export const calculateBalanceOf = async (tokenAddress: string, address: string, decimals: number) => {
  const erc20Token = await getStandardTokenContract()
  const web3 = getWeb3()
  let balance = 0

  try {
    const token = await erc20Token.at(tokenAddress)
    balance = await token.balanceOf(address)
  } catch (err) {
    console.error('Failed to fetch token balances: ', err)
  }

  console.log(
    tokenAddress,
    balance.toString(),
    10 ** decimals,
    web3.utils
      .toBN(balance)
      .div(web3.utils.toBN(10).pow(web3.utils.toBN(decimals)))
      .toString(),
  )

  return web3.utils
    .toBN(balance)
    .div(web3.utils.toBN(10).pow(web3.utils.toBN(decimals)))
    .toString()
}

export const fetchTokensData = async () => {
  const apiUrl = getRelayUrl()
  const url = `${apiUrl}/tokens`
  const errMsg = 'Error querying safe balances'
  return enhancedFetch(url, errMsg)
}

export const fetchTokens = (safeAddress: string) => async (dispatch: ReduxDispatch<GlobalState>) => {
  const tokens: List<string> = getActiveTokenAddresses(safeAddress)
  const ethBalance = await getSafeEthToken(safeAddress)
  const customTokens = getTokens(safeAddress)
  const { results } = await fetchTokensData()

  try {
    const balancesRecords = await Promise.all(
      results.map(async (item: TokenProps) => {
        const status = tokens.includes(item.address)
        const funds = status ? await calculateBalanceOf(item.address, safeAddress, item.decimals) : '0'

        return makeToken({ ...item, status, funds })
      }),
    )

    const customTokenRecords = await Promise.all(
      customTokens.map(async (item: TokenProps) => {
        const status = tokens.includes(item.address)
        const funds = status ? await calculateBalanceOf(item.address, safeAddress, item.decimals) : '0'

        return makeToken({ ...item, status, funds })
      }),
    )

    const balances: Map<string, Token> = Map().withMutations((map) => {
      balancesRecords.forEach(record => map.set(record.get('address'), record))
      customTokenRecords.forEach(record => map.set(record.get('address'), record))

      map.set(ethBalance.get('address'), ethBalance)
    })

    return dispatch(addTokens(safeAddress, balances))
  } catch (err) {
    // eslint-disable-next-line
    console.log('Error fetching tokens... ' + err)

    return Promise.resolve()
  }
}
