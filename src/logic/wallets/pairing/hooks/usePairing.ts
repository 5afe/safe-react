import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { getPairingUri, isPairingModule, isPairingUriLoaded } from 'src/logic/wallets/pairing/utils'
import onboard from 'src/logic/wallets/onboard'
import { getPairingProvider } from 'src/logic/wallets/pairing/module'
import { currentChainId } from 'src/logic/config/store/selectors'

const usePairing = (): { uri: string; isLoaded: boolean } => {
  const [uri, setUri] = useState<string>('')
  const chainId = useSelector(currentChainId)

  useEffect(() => {
    // Interface with the WC provider directly
    const pairingProvider = getPairingProvider(chainId)

    const DISPLAY_URI_EVENT = 'display_uri'

    // Save URI when WC generates it
    pairingProvider.wc.on(DISPLAY_URI_EVENT, (_, { params }) => {
      setUri(getPairingUri(params[0]))
    })

    // Create WC session if one is not already established
    if (!pairingProvider.wc.connected) {
      pairingProvider.enable()
    }

    return () => {
      // Remove lisener when unmounting
      // @ts-expect-error `off()` is not included in type
      pairingProvider.wc.off(DISPLAY_URI_EVENT)

      // Only disconnect if peer is connected, preventing invalid topic error
      const { name } = onboard().getState().wallet
      if (!isPairingModule(name) && pairingProvider.wc.peerId) {
        pairingProvider.wc.killSession()
      }
    }
  }, [])

  return { uri, isLoaded: isPairingUriLoaded(uri) }
}

export default usePairing
