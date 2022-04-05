import { useEffect, useMemo, useState } from 'react'

import { getPairingUri, isPairingModule } from 'src/logic/wallets/pairing/utils'
import onboard from 'src/logic/wallets/onboard'
import { getPairingProvider, PAIRING_MODULE_NAME } from 'src/logic/wallets/pairing/module'

// These handful of events relate to the session lifecycle
enum WC_EVENT {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  DISPLAY_URI = 'display_uri',
  SESSION_UPDATE = 'wc_sessionUpdate',
}

const usePairing = (): { uri: string } => {
  // Interface with the WalletConnect provider directly
  const provider = useMemo(getPairingProvider, [])

  const WC_EVENTS = useMemo(() => Object.values(WC_EVENT), [])
  const [uri, setUri] = useState<string>(getPairingUri(provider.wc.uri))

  const createPairingSession = () => {
    if (provider.wc.connected) {
      return
    }
    provider.enable()
    provider.wc.createSession()
  }

  const updatePairingUri = () => {
    const pairingUri = getPairingUri(provider.wc.uri)
    setUri(pairingUri)
  }

  const restartPairingSession = () => {
    onboard().walletReset()
    createPairingSession()
    updatePairingUri()
  }

  useEffect(() => {
    // Attach event listeners
    WC_EVENTS.forEach((event) => {
      provider.wc.on(event, () => {
        if (event === WC_EVENT.CONNECT) {
          console.log('connect')
          onboard().walletSelect(PAIRING_MODULE_NAME)
        }
        if (event === WC_EVENT.DISCONNECT) {
          restartPairingSession()
        }
        updatePairingUri()
      })
    })

    createPairingSession()

    return () => {
      // Remove event listeners on unmount
      // @ts-expect-error - `off()` is missing in provider type
      WC_EVENTS.forEach((event) => provider.wc.off(event))

      // Kill current session if another wallet is selected
      const { name } = onboard().getState().wallet
      if (name && !isPairingModule(name) && provider.wc.peerId) {
        provider.disconnect()
        return
      }

      // Otherwise attach disconnection event liseners
      provider.wc.on(WC_EVENT.DISCONNECT, restartPairingSession)
      provider.wc.on(WC_EVENT.SESSION_UPDATE, (_, { params }) => {
        // Session approval was revoked, 'disconnect' event doesn't fire
        if (params[0]?.approved === false) {
          restartPairingSession()
        }
      })
    }
  }, [WC_EVENTS, createPairingSession, provider, restartPairingSession, updatePairingUri])

  return { uri }
}

export default usePairing
