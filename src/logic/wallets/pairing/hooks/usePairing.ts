import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

import { ChainId } from 'src/config/chain'
import { currentChainId } from 'src/logic/config/store/selectors'
import onboard from 'src/logic/wallets/onboard'
import { initPairing, isPairingConnected, isPairingModule } from 'src/logic/wallets/pairing/utils'

const resetPairing = () => {
  if (isPairingModule() && !isPairingConnected()) {
    onboard().walletReset()
  }
}

const usePairing = (): void => {
  const chainId = useSelector(currentChainId)
  const prevChainId = useRef<ChainId>(chainId)

  useEffect(() => {
    if (!isPairingConnected()) {
      // Reset QR code if chain changed
      if (chainId !== prevChainId.current) {
        resetPairing()
        prevChainId.current = chainId
      }

      initPairing()
    }

    return () => {
      resetPairing()
    }
  }, [])
}

export default usePairing
