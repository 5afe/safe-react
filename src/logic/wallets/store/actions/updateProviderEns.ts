import { createAction } from 'redux-actions'

import { PROVIDER_ACTIONS } from 'src/logic/wallets/store/actions'
import { ProviderEnsPayload } from 'src/logic/wallets/store/reducer'

const updateProviderEns = createAction<ProviderEnsPayload>(PROVIDER_ACTIONS.ENS)

export default updateProviderEns
