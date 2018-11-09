// @flow
import enableToken from '~/routes/tokens/store/actions/enableToken'
import disableToken from '~/routes/tokens/store/actions/disableToken'

export type Actions = {
  enableToken: typeof enableToken,
  disableToken: typeof disableToken,
}

export default {
  enableToken,
  disableToken,
}
