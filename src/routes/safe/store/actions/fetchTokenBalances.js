// @flow
import type { Dispatch as ReduxDispatch } from 'redux'
import { Map, List } from 'immutable'
import { BigNumber } from 'bignumber.js'
import { type GlobalState } from '~/store/index'
import { type Token } from '~/logic/tokens/store/model/token'
import { ETH_ADDRESS } from '~/logic/tokens/utils/tokenHelpers'
import { getBalanceInEtherOf } from '~/logic/wallets/getWeb3'
import { getStandardTokenContract } from '~/logic/tokens/store/actions/fetchTokens'
import type { Safe } from '~/routes/safe/store/model/safe'
import updateSafe from './updateSafe'

export const calculateBalanceOf = async (tokenAddress: string, safeAddress: string, decimals: number = 18) => {
  if (tokenAddress === ETH_ADDRESS) {
    const ethBalance = await getBalanceInEtherOf(safeAddress)
    return ethBalance
  }

  const erc20Token = await getStandardTokenContract()
  let balance = 0

  try {
    const token = await erc20Token.at(tokenAddress)
    balance = await token.balanceOf(safeAddress)
  } catch (err) {
    console.error('Failed to fetch token balances: ', err)
  }

  return new BigNumber(balance).div(10 ** decimals).toString()
}

const fetchTokenBalances = (safe: Safe, tokens: List<Token>) => async (dispatch: ReduxDispatch<GlobalState>) => {
  if (!safe || !tokens || !tokens.size) {
    return
  }

  try {
    const withBalances = await Promise.all(
      tokens.map(async token => ({
        address: token.address,
        balance: await calculateBalanceOf(token.address, safe.address, token.decimals),
      })),
    )

    const safeWithBalances = safe.set('tokens', List(withBalances))

    dispatch(updateSafe(safeWithBalances))
  } catch (err) {
    // eslint-disable-next-line
    console.error('Error while loading active tokens from storage:', err)
  }
}

export default fetchTokenBalances
