import { useSelector } from 'react-redux'

import { useOnboard } from 'src/logic/wallets/onboard/useOnboard'
import { AppReduxState } from 'src/store'
import { shouldSwitchWalletChain } from 'src/logic/wallets/onboard/selectors'

const useShouldSwitchWalletChain = (): boolean => {
  const onboardState = useOnboard()
  const shouldSwitch = useSelector((state: AppReduxState) => shouldSwitchWalletChain(state, onboardState))

  return shouldSwitch
}

export default useShouldSwitchWalletChain
