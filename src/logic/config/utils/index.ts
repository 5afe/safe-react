import { setNetworkId, getConfig } from 'src/config'
import { ETHEREUM_NETWORK } from 'src/config/networks/network'
import { makeNetworkConfig } from 'src/logic/config/model/networkConfig'
import { configStore } from 'src/logic/config/store/actions'
import { store } from 'src/store'

export const setNetwork = (id: ETHEREUM_NETWORK) => {
  setNetworkId(id)
  const safeConfig = makeNetworkConfig(getConfig())
  store.dispatch(configStore(safeConfig))
}
