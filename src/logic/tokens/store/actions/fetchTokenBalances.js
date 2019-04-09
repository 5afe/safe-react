// @flow
import type { Dispatch as ReduxDispatch } from 'redux'
import { Map, List } from 'immutable'
import { BigNumber } from 'bignumber.js'
import { type GlobalState } from '~/store/index'
import { type Token } from '~/logic/tokens/store/model/token'
import { ETH_ADDRESS } from '~/logic/tokens/utils/tokenHelpers'
import { getBalanceInEtherOf } from '~/logic/wallets/getWeb3'
import { getStandardTokenContract } from './fetchTokens'
import { addTokens } from './saveTokens'

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

const fetchTokenBalances = (safeAddress: string, tokens: List<Token>) => async (
  dispatch: ReduxDispatch<GlobalState>,
) => {
  if (!safeAddress || !tokens || !tokens.size) {
    return
  }

  try {
    const withBalances = await Promise.all(
      tokens.map(async token => token.set('funds', await calculateBalanceOf(token.address, safeAddress, token.decimals))),
    )

    const tokensMap = Map().withMutations((map) => {
      withBalances.forEach(token => map.set(token.address, token))
    })

    dispatch(addTokens(safeAddress, tokensMap))
  } catch (err) {
    // eslint-disable-next-line
    console.error('Error while loading active tokens from storage:', err)
  }
}

export default fetchTokenBalances
