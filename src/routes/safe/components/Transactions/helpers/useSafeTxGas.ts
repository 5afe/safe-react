import { useSelector } from 'react-redux'
import { currentSafeCurrentVersion } from 'src/logic/safe/store/selectors'
import { hasFeature } from 'src/logic/safe/utils/safeVersion'
import { FEATURES } from 'src/config/networks/network.d'

const useSafeTxGas = (): boolean => {
  const safeVersion = useSelector(currentSafeCurrentVersion)
  const showSafeTxGas = !hasFeature(safeVersion, FEATURES.SAFE_TX_GAS_OPTIONAL)
  return showSafeTxGas
}

export default useSafeTxGas
