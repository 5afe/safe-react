// @flow
import type { Dispatch as ReduxDispatch } from 'redux'
import { Map, List } from 'immutable'
import { type TokenProps, type Token, makeToken } from '~/logic/tokens/store/model/token'
import { type GlobalState } from '~/safeStore'
import { getActiveTokens } from '~/logic/tokens/utils/tokensStorage'
import saveTokens from './saveTokens'

const loadActiveTokens = () => async (dispatch: ReduxDispatch<GlobalState>) => {
  try {
    const tokens: Map<string, TokenProps> = await getActiveTokens()
    const tokenRecordsList: List<Token> = List(
      Object.values(tokens).map((token: TokenProps): Token => makeToken(token)),
    )

    dispatch(saveTokens(tokenRecordsList))
  } catch (err) {
    // eslint-disable-next-line
    console.error('Error while loading active tokens from storage:', err)
  }
}

export default loadActiveTokens
