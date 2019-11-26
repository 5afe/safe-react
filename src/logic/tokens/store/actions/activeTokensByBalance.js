// @flow
import type { Dispatch as ReduxDispatch } from 'redux'
import BigNumber from 'bignumber.js'
import { List, Set } from 'immutable'
import { type GetState, type GlobalState } from '~/store'
import { tokenListSelector } from '~/logic/tokens/store/selectors'
import { calculateBalanceOf } from '~/routes/safe/store/actions/fetchTokenBalances'
import updateActiveTokens from '~/routes/safe/store/actions/updateActiveTokens'
import {
  safeActiveTokensSelectorBySafe,
  safeBlacklistedTokensSelectorBySafe,
  safesMapSelector,
} from '~/routes/safe/store/selectors'

const activeTokensByBalance = (safeAddress: string) => async (dispatch: ReduxDispatch<GlobalState>, getState: GetState) => {
  try {
    const state = getState()
    const tokens = tokenListSelector(state)
    const safes = safesMapSelector(state)
    const activeTokens = safeActiveTokensSelectorBySafe(safeAddress, safes)
    const blacklistedTokens = safeBlacklistedTokensSelectorBySafe(safeAddress, safes)

    const activeByBalance = (await Promise.all(
      tokens.map(async (token) => {
        const balance = await calculateBalanceOf(token.address, safeAddress, token.decimals)
        return {
          address: token.address,
          balance,
        }
      }),
    ))
      .filter(({ address }) => !blacklistedTokens.includes(address))
      .filter(({ address, balance }) => activeTokens.includes(address) || BigNumber(balance).gt(0))
      .map(({ address }) => address)

    dispatch(updateActiveTokens(safeAddress, Set(activeByBalance)))

    return List(activeByBalance)
  } catch (err) {
    console.error('Error fetching token list', err)

    return Promise.resolve()
  }
}

export default activeTokensByBalance
