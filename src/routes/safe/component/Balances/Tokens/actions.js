// @flow
import enableToken from '~/logic/tokens/store/actions/enableToken'
import disableToken from '~/logic/tokens/store/actions/disableToken'
import fetchTokens from '~/logic/tokens/store/actions/fetchTokens'

export type Actions = {
  enableToken: Function,
  disableToken: Function,
  fetchTokens: Function
}

export default {
  enableToken,
  disableToken,
  fetchTokens,
}
