// @flow
import type { Dispatch as ReduxDispatch } from 'redux'
import { List } from 'immutable'
import { BigNumber } from 'bignumber.js'
import { type GlobalState } from '~/store/index'
import { type Token } from '~/logic/tokens/store/model/token'
import TokenBalanceRecord from '~/routes/safe/store/models/tokenBalance'
import { getStandardTokenContract } from '~/logic/tokens/store/actions/fetchTokens'
import updateSafe from './updateSafe'
import { ETH_ADDRESS } from '~/logic/tokens/utils/tokenHelpers'

export const calculateBalanceOf = async (tokenAddress: string, safeAddress: string, decimals: number = 18) => {
  console.log('calculateBalanceOf start', tokenAddress, safeAddress, decimals)
  if (tokenAddress === ETH_ADDRESS) {
    console.log('calculateBalanceOf eth')
    return '0'
  }
  console.log('calculateBalanceOf continue')
  const erc20Token = await getStandardTokenContract()
  console.log('calculateBalanceOf end', erc20Token)
  let balance = 0

  try {
    const token = await erc20Token.at(tokenAddress)
    balance = await token.balanceOf(safeAddress)
    console.log('tokenAddress', balance)
  } catch (err) {
    console.error('Failed to fetch token balances: ', err)
  }

  return new BigNumber(balance).div(10 ** decimals).toString()
}

const fetchTokenBalances = (safeAddress: string, tokens: List<Token>) => async (
  dispatch: ReduxDispatch<GlobalState>,
) => {
  console.log('fetchTokenBalances')
  if (!safeAddress || !tokens || !tokens.size) {
    return
  }
  console.log('fetchTokenBalances tokens', tokens)
  try {
    const withBalances = await Promise.all(
      tokens.map(async token => {
        const balance = await calculateBalanceOf(token.address, safeAddress, token.decimals)
        console.log('balance', token.address, balance)
        return TokenBalanceRecord({
          address: token.address,
          balance,
        })
      })
    )
    console.log('fetchTokenBalances withBalances', withBalances)
    dispatch(updateSafe({ address: safeAddress, balances: List(withBalances) }))
    console.log('fetchTokenBalances end')
  } catch (err) {
    // eslint-disable-next-line
    console.error('Error while loading active tokens from storage:', err)
  }
}

export default fetchTokenBalances
