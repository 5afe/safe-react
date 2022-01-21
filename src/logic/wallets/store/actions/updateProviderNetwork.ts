import { createAction } from 'redux-actions'

import { PROVIDER_ACTIONS } from 'src/logic/wallets/store/actions'
import { ProviderNetworkPayload } from 'src/logic/wallets/store/reducer'

const updateProviderNetwork = createAction<ProviderNetworkPayload>(PROVIDER_ACTIONS.NETWORK)

export default updateProviderNetwork
