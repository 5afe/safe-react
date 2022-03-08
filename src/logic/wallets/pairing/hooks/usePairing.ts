import { useState, useEffect } from 'react'

import { getPairingUri, initPairing, isPairingWallet } from 'src/logic/wallets/pairing/utils'
import { useOnboard } from 'src/logic/wallets/onboard/useOnboard'

const usePairing = (): { uri: string; isLoaded: boolean } => {
  const [uri, setUri] = useState<string>('')
  const { wallet } = useOnboard()
  const pairingUri = getPairingUri()

  useEffect(() => {
    initPairing()
  }, [])

  useEffect(() => {
    setUri(pairingUri)
  }, [pairingUri])

  return { uri, isLoaded: isPairingWallet(wallet.label) }
}

export default usePairing
