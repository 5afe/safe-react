// @flow
import addToken from '~/routes/tokens/store/actions/addToken'
import removeToken from '~/routes/tokens/store/actions/removeToken'
import enableToken from '~/routes/tokens/store/actions/enableToken'
import disableToken from '~/routes/tokens/store/actions/disableToken'
import { fetchTokens } from '~/routes/tokens/store/actions/fetchTokens'

export type Actions = {
  enableToken: typeof enableToken,
  disableToken: typeof disableToken,
  addToken: typeof addToken,
  removeToken: typeof removeToken,
}

export default {
  addToken,
  removeToken,
  enableToken,
  disableToken,
  fetchTokens,
}
