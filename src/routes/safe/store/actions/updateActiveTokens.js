// @flow
import { createAction } from 'redux-actions'
import type { Dispatch as ReduxDispatch } from 'redux'
import { type GlobalState } from '~/store'
import type { SafeToken } from '~/routes/safe/store/models/safeToken'
import SafeTokenRecord from '~/routes/safe/store/models/safeToken'

export const UPDATE_SAFE_TOKENS = 'UPDATE_SAFE_TOKENS'

type ActionReturn = {
  token: SafeToken,
}

export const updateTokenAction = createAction<string, Function, ActionReturn>(
  UPDATE_SAFE_TOKENS,
  (token: SafeToken): ActionReturn => ({
    token,
  }),
)

const updateActiveTokens = (safeAddress: string, tokenAddress: string) => async (
  dispatch: ReduxDispatch<GlobalState>,
) => {
  const token: SafeToken = SafeTokenRecord({ address: tokenAddress })

  dispatch(updateTokenAction(token))
}

export default updateActiveTokens
