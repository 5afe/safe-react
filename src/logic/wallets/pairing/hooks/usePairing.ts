import { useCallback, useEffect, useMemo, useState } from 'react'

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

  const cleanupEventListeners = useCallback(() => {
    // @ts-expect-error - `off()` is missing in `IConnector` type
    WC_EVENTS.forEach((event) => provider.wc.off(event))
  }, [provider])

  const createPairingSession = useCallback(() => {
    if (provider.wc.connected) {
      return
    }
    provider.enable()
    provider.wc.createSession()
  }, [provider])

  const updatePairingUri = useCallback(() => {
    const pairingUri = getPairingUri(provider.wc.uri)
    setUri(pairingUri)
  }, [provider])

  const restartPairingSession = useCallback(() => {
    onboard().walletReset()
    createPairingSession()
    updatePairingUri()
  }, [createPairingSession, updatePairingUri])

  useEffect(() => {
    // Prevent duplicate event listeners from being added
    cleanupEventListeners()

    provider.wc.on(WC_EVENT.CONNECT, () => {
      onboard().walletSelect(PAIRING_MODULE_NAME)
    })

    provider.wc.on(WC_EVENT.DISCONNECT, restartPairingSession)

    WC_EVENTS.forEach((event) => provider.wc.on(event, updatePairingUri))

    createPairingSession()

    return () => {
      const { name } = onboard().getState().wallet
      const connectedToNonPairingWallet = name && !isPairingModule(name) && provider.wc.peerId
      if (connectedToNonPairingWallet) {
        cleanupEventListeners()
        provider.disconnect()
        return
      }

      provider.wc.on(WC_EVENT.SESSION_UPDATE, (_, { params }) => {
        const didRevokeSessionApproval = params[0]?.approved === false
        if (didRevokeSessionApproval) {
          restartPairingSession()
        }
      })
    }
  }, [cleanupEventListeners, WC_EVENTS, createPairingSession, provider, restartPairingSession, updatePairingUri])

  return { uri }
}

export default usePairing
