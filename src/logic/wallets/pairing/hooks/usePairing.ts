import { useCallback, useEffect, useMemo, useState } from 'react'
import { IEventEmitter } from '@walletconnect/types'

import { getPairingUri } from 'src/logic/wallets/pairing/utils'
import onboard from 'src/logic/wallets/onboard'
import { getPairingProvider, PAIRING_MODULE_NAME } from 'src/logic/wallets/pairing/module'

let preservedOnboardEvents: IEventEmitter[]

// These handful of events relate to the session lifecycle
enum WC_EVENT {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  DISPLAY_URI = 'display_uri',
  SESSION_UPDATE = 'wc_sessionUpdate',
}

const usePairing = (): { uri: string } => {
  const provider = useMemo(getPairingProvider, [])
  const WC_EVENTS = useMemo(() => Object.values(WC_EVENT), [])

  const [uri, setUri] = useState<string>(getPairingUri(provider.wc.uri))
  const updatePairingUri = useCallback(() => {
    const pairingUri = getPairingUri(provider.wc.uri)
    setUri(pairingUri)
  }, [provider])

  // Pairing session lifecycle
  const createPairingSession = useCallback(() => {
    if (!provider.wc.connected) {
      provider.enable()
      provider.wc.createSession()
    }
  }, [provider])

  // Event listeners
  const addCustomEventListeners = useCallback(() => {
    // Watch for URI change
    WC_EVENTS.forEach((event) => provider.wc.on(event, updatePairingUri))

    // Handle connection
    provider.wc.on(WC_EVENT.CONNECT, () => {
      onboard().walletSelect(PAIRING_MODULE_NAME)
    })

    // Handle disconnection/session revocation
    const restartPairingSession = () => {
      onboard().walletReset()
      createPairingSession()
    }

    provider.wc.on(WC_EVENT.DISCONNECT, restartPairingSession)
    provider.wc.on(WC_EVENT.SESSION_UPDATE, (_, { params }) => {
      const didRevokeSession = params[0]?.approved === false
      if (didRevokeSession) {
        restartPairingSession()
      }
    })
  }, [WC_EVENTS, provider, updatePairingUri])

  const cleanupCustomEventListeners = useCallback(() => {
    if (!preservedOnboardEvents) {
      preservedOnboardEvents = (provider.wc as any)._eventManager._eventEmitters as IEventEmitter[]
    }

    // @ts-expect-error - `.off()` is missing in `IConnector` type
    WC_EVENTS.forEach((event) => provider.wc.off(event))

    // WalletConnect removes all event listeners by event name so we must add onboard's back
    preservedOnboardEvents.forEach(({ event, callback }) => provider.wc.on(event, callback))
  }, [WC_EVENTS, provider])

  useEffect(() => {
    cleanupCustomEventListeners()
    addCustomEventListeners()

    createPairingSession()
  }, [cleanupCustomEventListeners, addCustomEventListeners, createPairingSession])

  return { uri }
}

export default usePairing
