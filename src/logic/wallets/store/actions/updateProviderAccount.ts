import { createAction } from 'redux-actions'

import { PROVIDER_ACTIONS } from 'src/logic/wallets/store/actions'
import { ProviderAccountPayload } from 'src/logic/wallets/store/reducer'

const updateProviderAccount = createAction<ProviderAccountPayload>(PROVIDER_ACTIONS.ACCOUNT)

export default updateProviderAccount
