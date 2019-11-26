// @flow
import { createAction } from 'redux-actions'

export const BLACKLIST_TOKEN_FOR_ALL_SAFES = 'BLACKLIST_TOKEN_FOR_ALL_SAFES'

const blacklistTokenForAllSafes = createAction<string, *>(BLACKLIST_TOKEN_FOR_ALL_SAFES)

export default blacklistTokenForAllSafes
