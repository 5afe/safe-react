import { useState, useEffect } from 'react'

import { getPairingUri, initPairing, isPairingWallet } from 'src/logic/wallets/pairing/utils'
import { useOnboard } from 'src/logic/wallets/onboard/useOnboard'
import { getPairingConnector, PAIRING_MODULE_NAME, PAIRING_STORAGE_ID } from 'src/logic/wallets/pairing'
import { getOnboardInstance } from 'src/logic/wallets/onboard'

const pairingConnector = getPairingConnector()

const usePairing = (): { uri: string; isLoaded: boolean } => {
  const [uri, setUri] = useState<string>('')
  const { wallet } = useOnboard()
  const pairingUri = getPairingUri()

  useEffect(() => {
    initPairing()
  }, [])

  useEffect(() => {
    const subscription = getOnboardInstance()
      .state.select('wallets')
      .subscribe((wallets) => {
        if (wallets.length === 0) {
          if (!pairingConnector.connected) {
            pairingConnector.createSession()
          }
          return
        }

        const hasPairingWallet = wallets.some(({ label }) => label === PAIRING_MODULE_NAME)
        if (!hasPairingWallet) {
          pairingConnector.killSession()
          localStorage.removeItem(PAIRING_STORAGE_ID)
        }
      })

    return subscription.unsubscribe.bind(subscription)
  }, [wallet.label])

  useEffect(() => {
    setUri(pairingUri)
  }, [pairingUri])

  return { uri, isLoaded: isPairingWallet(wallet.label) }
}

export default usePairing
