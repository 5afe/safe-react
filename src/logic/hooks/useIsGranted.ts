import { useSelector } from 'react-redux'

import { useOnboard } from 'src/logic/wallets/onboard/useOnboard'
import { AppReduxState } from 'src/store'
import { grantedSelector } from 'src/routes/safe/container/selector'

const useIsGranted = (): boolean => {
  const onboardState = useOnboard()
  const isGranted = useSelector((state: AppReduxState) => grantedSelector(state, onboardState))

  return isGranted
}

export default useIsGranted
