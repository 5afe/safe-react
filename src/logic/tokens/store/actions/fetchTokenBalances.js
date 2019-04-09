// @flow
import type { Dispatch as ReduxDispatch } from 'redux'
import { Map, List } from 'immutable'
import { type Token } from '~/logic/tokens/store/model/token'
import { type GlobalState } from '~/store/index'
import { calculateBalanceOf } from './fetchTokens'
import { addTokens } from './saveTokens'

const fetchTokenBalances = (safeAddress: string, tokens: List<Token>) => async (
  dispatch: ReduxDispatch<GlobalState>,
) => {
  if (!safeAddress || !tokens || !tokens.size) {
    return
  }

  try {
    const withBalances = await Promise.all(
      tokens.map(async token => token.set('funds', await calculateBalanceOf(token.address, safeAddress))),
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
