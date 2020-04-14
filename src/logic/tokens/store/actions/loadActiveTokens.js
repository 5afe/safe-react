// @flow
import { List, Map } from 'immutable'
import type { Dispatch as ReduxDispatch } from 'redux'

import saveTokens from './saveTokens'

import { type Token, type TokenProps, makeToken } from '~/logic/tokens/store/model/token'
import { getActiveTokens } from '~/logic/tokens/utils/tokensStorage'
import { type GlobalState } from '~/store/index'

const loadActiveTokens = () => async (dispatch: ReduxDispatch<GlobalState>) => {
  try {
    const tokens: Map<string, TokenProps> = await getActiveTokens()
    // The filter of strings was made because of the issue #751. Please see: https://github.com/gnosis/safe-react/pull/755#issuecomment-612969340
    const tokenRecordsList: List<Token> = List(
      Object.values(tokens)
        .filter((t) => typeof t.decimals !== 'string')
        .map((token: TokenProps): Token => makeToken(token)),
    )

    dispatch(saveTokens(tokenRecordsList))
  } catch (err) {
    // eslint-disable-next-line
    console.error('Error while loading active tokens from storage:', err)
  }
}

export default loadActiveTokens
