import { FEATURES } from '@gnosis.pm/safe-react-gateway-sdk'
import { useSelector } from 'react-redux'
import { currentSafeCurrentVersion } from 'src/logic/safe/store/selectors'
import { hasFeature } from 'src/logic/safe/utils/safeVersion'

const useSafeTxGas = (): boolean => {
  const safeVersion = useSelector(currentSafeCurrentVersion)
  const showSafeTxGas = !hasFeature(FEATURES.SAFE_TX_GAS_OPTIONAL, safeVersion)
  return showSafeTxGas
}

export default useSafeTxGas
