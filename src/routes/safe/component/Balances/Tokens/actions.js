// @flow
import enableToken from '~/logic/tokens/store/actions/enableToken'
import disableToken from '~/logic/tokens/store/actions/disableToken'

export type Actions = {
  enableToken: typeof enableToken,
  disableToken: typeof disableToken,
}

export default {
  enableToken,
  disableToken,
}
