import { useState, useEffect } from 'react'

import { getPairingUri, isPairingWallet, isUriLoaded } from 'src/logic/wallets/pairing/utils'
import { getPairingConnector } from 'src/logic/wallets/pairing'
import { getOnboardState } from 'src/logic/wallets/onboard'
import { useOnboard } from 'src/logic/wallets/onboard/useOnboard'

const pairingConnector = getPairingConnector()

const usePairing = (): { uri: string; isLoaded: boolean } => {
  const [uri, setUri] = useState<string>(getPairingUri)
  const { wallet } = useOnboard()

  useEffect(() => {
    const DISPLAY_URI_EVENT = 'display_uri'

    pairingConnector.on(DISPLAY_URI_EVENT, (_, { params }) => {
      setUri(getPairingUri(params[0]))
    })

    if (!wallet.label && !pairingConnector.connected) {
      pairingConnector.createSession()
    }

    return () => {
      pairingConnector.off(DISPLAY_URI_EVENT)

      const { label } = getOnboardState().wallet
      if (label && !isPairingWallet(label) && pairingConnector.peerId) {
        pairingConnector.killSession()
      }
    }
  }, [wallet])

  return { uri, isLoaded: isUriLoaded(uri) }
}

export default usePairing
