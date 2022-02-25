import { createAction } from 'redux-actions'

import { PROVIDER_ACTIONS } from 'src/logic/wallets/store/actions'
import { ProviderNamePayload } from 'src/logic/wallets/store/reducer'

const updateProviderWallet = createAction<ProviderNamePayload>(PROVIDER_ACTIONS.NAME)

export default updateProviderWallet
