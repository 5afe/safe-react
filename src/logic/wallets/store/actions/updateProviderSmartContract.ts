import { createAction } from 'redux-actions'

import { PROVIDER_ACTIONS } from 'src/logic/wallets/store/actions'
import { ProviderSmartContractPayload } from 'src/logic/wallets/store/reducer'

export const updateProviderSmartContract = createAction<ProviderSmartContractPayload>(PROVIDER_ACTIONS.SMART_CONTRACT)
