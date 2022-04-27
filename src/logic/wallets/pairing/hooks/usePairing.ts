import { useEffect } from 'react'

import { initPairing, isPairingConnected } from 'src/logic/wallets/pairing/utils'

const usePairing = (): void => {
  useEffect(() => {
    if (!isPairingConnected()) {
      initPairing()
    }
  }, [])
}

export default usePairing
