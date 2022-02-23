import { useEffect } from 'react'

import onboard from 'src/logic/wallets/onboard'
import { initPairing, isPairingConnected, isPairingModule } from 'src/logic/wallets/pairing/utils'

const usePairing = (): void => {
  useEffect(() => {
    if (!isPairingConnected()) {
      initPairing()
    }

    return () => {
      if (isPairingModule() && !isPairingConnected()) {
        onboard().walletReset()
      }
    }
  }, [])
}

export default usePairing
