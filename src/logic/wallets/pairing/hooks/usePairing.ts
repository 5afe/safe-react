import { useEffect } from 'react'

import onboard from 'src/logic/wallets/onboard'
import { PAIRING_MODULE_NAME } from 'src/logic/wallets/pairing/module'
import { isPairingConnected, isPairingModule } from 'src/logic/wallets/pairing/utils'

const usePairing = (): void => {
  useEffect(() => {
    if (isPairingConnected()) {
      return
    }

    const initPairing = async () => {
      await onboard().walletSelect(PAIRING_MODULE_NAME)
    }
    initPairing()

    return () => {
      const { wallet } = onboard().getState()
      if (isPairingModule(wallet) && !isPairingConnected()) {
        onboard().walletReset()
      }
    }
  }, [])
}

export default usePairing
