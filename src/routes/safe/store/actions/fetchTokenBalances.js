// @flow
import { BigNumber } from 'bignumber.js'
import { List, Map } from 'immutable'
import type { Dispatch as ReduxDispatch } from 'redux'

import updateSafe from './updateSafe'

import { getStandardTokenContract } from '~/logic/tokens/store/actions/fetchTokens'
import { type Token } from '~/logic/tokens/store/model/token'
import { ETH_ADDRESS } from '~/logic/tokens/utils/tokenHelpers'
import { getWeb3 } from '~/logic/wallets/getWeb3'
import { type GlobalState } from '~/store/index'

const getBatchBalances = async (tokens: List<Token>, safeAddress: string) => {
  const erc20Token = await getStandardTokenContract()
  const web3 = getWeb3()
  const batch = new web3.BatchRequest()

  const balances = tokens
    .toJS()
    .filter(({ address }) => address !== ETH_ADDRESS)
    .map(async ({ address, decimals }: any) => {
      const tokenInstance = await erc20Token.at(address)
      const request = tokenInstance.balanceOf(safeAddress).then(balance => ({
        address,
        balance: new BigNumber(balance).div(10 ** decimals).toString(),
      }))

      batch.add(request)

      return request
    })

  batch.execute()

  return Promise.all(balances)
}

export const calculateBalanceOf = async (tokenAddress: string, safeAddress: string, decimals: number = 18) => {
  if (tokenAddress === ETH_ADDRESS) {
    return '0'
  }
  const erc20Token = await getStandardTokenContract()
  let balance = 0

  try {
    const token = await erc20Token.at(tokenAddress)
    balance = await token.balanceOf(safeAddress)
  } catch (err) {
    console.error('Failed to fetch token balances: ', tokenAddress, err)
  }

  return new BigNumber(balance).div(10 ** decimals).toString()
}

const fetchTokenBalances = (safeAddress: string, tokens: List<Token>) => async (
  dispatch: ReduxDispatch<GlobalState>,
) => {
  if (!safeAddress || !tokens || !tokens.size) {
    return
  }
  try {
    const withBalances = await getBatchBalances(tokens, safeAddress)

    const balances = Map().withMutations(map => {
      withBalances.forEach(({ address, balance }) => {
        map.set(address, balance)
      })
    })

    dispatch(updateSafe({ address: safeAddress, balances }))
  } catch (err) {
    console.error('Error when fetching token balances:', err)
  }
}

export default fetchTokenBalances
