import { createAction } from 'redux-actions'

import { PROVIDER_ACTIONS } from 'src/logic/wallets/store/actions'
import { ProviderWalletPayload } from 'src/logic/wallets/store/reducer'

const updateProviderWallet = createAction<ProviderWalletPayload>(PROVIDER_ACTIONS.WALLET)

export default updateProviderWallet
