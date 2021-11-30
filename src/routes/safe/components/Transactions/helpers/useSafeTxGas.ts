import { useSelector } from 'react-redux'

import { SAFE_FEATURES } from 'src/config/chain.d'
import { currentSafeCurrentVersion } from 'src/logic/safe/store/selectors'
import { hasFeature } from 'src/logic/safe/utils/safeVersion'

const useSafeTxGas = (): boolean => {
  const safeVersion = useSelector(currentSafeCurrentVersion)
  const showSafeTxGas = !hasFeature(safeVersion, SAFE_FEATURES.SAFE_TX_GAS_OPTIONAL)
  return showSafeTxGas
}

export default useSafeTxGas
