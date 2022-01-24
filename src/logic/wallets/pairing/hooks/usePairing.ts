import { useEffect } from 'react'

import onboard from 'src/logic/wallets/onboard'
import { PAIRING_MODULE_NAME } from 'src/logic/wallets/pairing/module'
import { isPairingModule } from 'src/logic/wallets/pairing/utils'

const usePairing = (): void => {
  useEffect(() => {
    if (onboard().getState().wallet.provider?.connected) {
      return
    }

    const initPairing = async () => {
      await onboard().walletSelect(PAIRING_MODULE_NAME)
    }
    initPairing()

    return () => {
      const { wallet } = onboard().getState()
      if (isPairingModule(wallet) && !wallet.provider?.connected) {
        onboard().walletReset()
      }
    }
  }, [])
}

export default usePairing
