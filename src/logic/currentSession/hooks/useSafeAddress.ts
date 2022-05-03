import { useSelector } from 'react-redux'
import { getShortName } from 'src/config'
import { currentSafe } from 'src/logic/safe/store/selectors'
import { currentSession } from '../store/selectors'

const useSafeAddress = (): { shortName: string; safeAddress: string } => {
  const safe = useSelector(currentSafe)
  const { currentShortName, currentSafeAddress } = useSelector(currentSession)

  return {
    shortName: currentShortName || getShortName(),
    safeAddress: currentSafeAddress || safe.address,
  }
}

export default useSafeAddress
