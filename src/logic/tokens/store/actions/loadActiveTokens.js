// 
import { List, Map } from 'immutable'

import saveTokens from './saveTokens'

import { makeToken } from 'logic/tokens/store/model/token'
import { getActiveTokens } from 'logic/tokens/utils/tokensStorage'
import { } from 'store/index'

const loadActiveTokens = () => async (dispatch) => {
  try {
    const tokens = await getActiveTokens()
    // The filter of strings was made because of the issue #751. Please see: https://github.com/gnosis/safe-react/pull/755#issuecomment-612969340
    const tokenRecordsList = List(
      Object.values(tokens)
        .filter((t) => typeof t.decimals !== 'string')
        .map((token) => makeToken(token)),
    )

    dispatch(saveTokens(tokenRecordsList))
  } catch (err) {
    // eslint-disable-next-line
    console.error('Error while loading active tokens from storage:', err)
  }
}

export default loadActiveTokens
