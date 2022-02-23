import { ChainId } from 'src/config/chain.d'
import { store } from 'src/store'
import { setChainIdAction } from 'src/logic/config/store/actions'
import { _setChainId } from 'src/config'
import onboard from 'src/logic/wallets/onboard'

export const setChainId = (newChainId: ChainId) => {
  _setChainId(newChainId)
  store.dispatch(setChainIdAction(newChainId))

  // Update Onboard's internal `appNetworkId` (not the provider)
  onboard().config({ networkId: parseInt(newChainId, 10) })
}
