// @flow
import { List } from 'immutable'
import type { Dispatch as ReduxDispatch, GetState } from 'redux'
import { type GlobalState } from '~/store'
import type { SafeToken } from '~/routes/safe/store/models/safeToken'
import SafeTokenRecord from '~/routes/safe/store/models/safeToken'
import { safeTokensSelector } from '~/routes/safe/store/selectors/index'
import { SAFE_PARAM_ADDRESS } from '~/routes/routes'
import updateSafe from './updateSafe'

// the selector uses ownProps argument/router props to get the address of the safe
// so in order to use it I had to recreate the same structure
const generateMatchProps = (safeAddress: string) => ({
  match: {
    params: {
      [SAFE_PARAM_ADDRESS]: safeAddress,
    },
  },
})

const updateActiveTokens = (safeAddress: string, tokenAddress: string) => async (
  dispatch: ReduxDispatch<GlobalState>,
  getState: GetState<GlobalState>,
) => {
  const token: SafeToken = SafeTokenRecord({ address: tokenAddress })
  const state = getState()
  const safeTokens: List<SafeToken> = safeTokensSelector(state, generateMatchProps(safeAddress))
  const index = safeTokens.findIndex(safeToken => safeToken.address === token.address)

  let updatedTokens
  if (index !== -1) {
    updatedTokens = safeTokens.delete(index)
  } else {
    updatedTokens = safeTokens.push(token)
  }

  dispatch(updateSafe({ address: safeAddress, tokens: updatedTokens }))
}

export default updateActiveTokens
