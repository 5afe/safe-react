// @flow
import addToken from '~/routes/tokens/store/actions/addTokens'
import enableToken from '~/routes/tokens/store/actions/enableToken'
import disableToken from '~/routes/tokens/store/actions/disableToken'
import { fetchTokens } from '~/routes/tokens/store/actions/fetchTokens'

export type Actions = {
  enableToken: typeof enableToken,
  disableToken: typeof disableToken,
  addToken: typeof addToken,
}

export default {
  addToken,
  enableToken,
  disableToken,
  fetchTokens,
}
