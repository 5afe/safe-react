import { useCallback, useEffect, useMemo, useState } from 'react'
import { IEventEmitter } from '@walletconnect/types'

import { getPairingUri } from 'src/logic/wallets/pairing/utils'
import onboard from 'src/logic/wallets/onboard'
import { getPairingProvider, PAIRING_MODULE_NAME } from 'src/logic/wallets/pairing/module'

let defaultEvents: IEventEmitter[]

// These handful of events relate to the session lifecycle
enum WC_EVENT {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  DISPLAY_URI = 'display_uri',
  SESSION_UPDATE = 'wc_sessionUpdate',
}

const usePairing = (): { uri: string } => {
  const provider = useMemo(getPairingProvider, [])

  const [uri, setUri] = useState<string>(getPairingUri(provider.wc.uri))

  // Pairing session lifecycle
  const createPairingSession = useCallback(() => {
    if (!provider.wc.connected) {
      provider.enable()
      provider.wc.createSession()
    }
  }, [provider])

  useEffect(() => {
    if (!defaultEvents) {
      defaultEvents = (provider.wc as any)._eventManager._eventEmitters as IEventEmitter[]
    }

    // Resest event listeners to default
    ;(provider.wc as any)._eventManager._eventEmitters = defaultEvents

    // Watch for URI change
    Object.values(WC_EVENT).forEach((event) =>
      provider.wc.on(event, () => {
        const pairingUri = getPairingUri(provider.wc.uri)
        setUri(pairingUri)
      }),
    )

    // Watch for connection
    provider.wc.on(WC_EVENT.CONNECT, () => {
      onboard().walletSelect(PAIRING_MODULE_NAME)
    })

    // Handle disconnection (`walletReset()` occurs inside pairing module)
    provider.wc.on(WC_EVENT.DISCONNECT, createPairingSession)
    provider.wc.on(WC_EVENT.SESSION_UPDATE, (_, { params }) => {
      const didRevokeSession = params[0]?.approved === false
      if (didRevokeSession) {
        createPairingSession()
      }
    })

    // Create pairing session if one isn't already active
    createPairingSession()
  }, [createPairingSession, provider.wc])

  return { uri }
}

export default usePairing
