import { Dispatch } from 'src/logic/safe/store/actions/types.d'
import { createAction } from 'redux-actions'

import { onboard } from 'src/components/ConnectButton'
import { resetWeb3 } from 'src/logic/wallets/getWeb3'

export const REMOVE_PROVIDER = 'REMOVE_PROVIDER'

const removeProvider = createAction(REMOVE_PROVIDER)

export default () =>
  (dispatch: Dispatch): void => {
    onboard().walletReset()
    resetWeb3()

    dispatch(removeProvider())
  }
