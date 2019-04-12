// @flow
import type { Dispatch as ReduxDispatch } from 'redux'
import { List, Map } from 'immutable'
import { type TokenProps, type Token, makeToken } from '~/logic/tokens/store/model/token'
import { type GlobalState } from '~/store/index'
import { getActiveTokens } from '~/logic/tokens/utils/tokensStorage'
import saveTokens from './saveTokens'

const loadActiveTokens = () => async (dispatch: ReduxDispatch<GlobalState>) => {
  try {
    const tokens: List<TokenProps> = await getActiveTokens()

    const tokenRecords: Map<string, Token> = Map().withMutations((map) => {
      tokens.forEach(token => map.set(token.address, makeToken(token)))
    })

    dispatch(saveTokens(tokenRecords))
  } catch (err) {
    // eslint-disable-next-line
    console.error('Error while loading active tokens from storage:', err)
  }
}

export default loadActiveTokens
