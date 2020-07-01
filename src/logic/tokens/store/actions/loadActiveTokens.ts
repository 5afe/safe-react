import { List } from 'immutable'

import saveTokens from './saveTokens'

import { makeToken } from 'src/logic/tokens/store/model/token'
import { getActiveTokens } from 'src/logic/tokens/utils/tokensStorage'

const loadActiveTokens = () => async (dispatch) => {
  try {
    const tokens = (await getActiveTokens()) || {}
    // The filter of strings was made because of the issue #751. Please see: https://github.com/gnosis/safe-react/pull/755#issuecomment-612969340
    const tokenRecordsList = List(
      Object.values(tokens)
        .filter((t: any) => typeof t.decimals !== 'string')
        .map((token) => makeToken(token)),
    )

    dispatch(saveTokens(tokenRecordsList))
  } catch (err) {
    // eslint-disable-next-line
    console.error('Error while loading active tokens from storage:', err)
  }
}

export default loadActiveTokens
