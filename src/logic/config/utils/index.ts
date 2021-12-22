import { _getChainId, _setChainId } from 'src/config'
import { ChainId } from 'src/config/chain.d'
import { store } from 'src/store'
import { setChainIdAction } from 'src/logic/config/store/actions'

export const setChainId = (newChainId: ChainId) => {
  _setChainId(newChainId)
  store.dispatch(setChainIdAction(newChainId))
}
