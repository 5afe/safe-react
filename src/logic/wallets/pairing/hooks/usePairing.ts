import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import { getPairingUri } from 'src/logic/wallets/pairing/utils'
import { getPairingProvider } from 'src/logic/wallets/pairing/module'
import { configState } from 'src/logic/config/store/selectors'

let isProviderEnabled = false

const usePairing = (): { uri: string } => {
  const provider = useMemo(() => {
    const provider = getPairingProvider()
    isProviderEnabled = provider.wc.session.connected
    return provider
  }, [])

  // Sync provider with chainId of the UI
  const { chainId } = useSelector(configState)
  useEffect(() => {
    provider.chainId = parseInt(chainId, 10)
  }, [provider, chainId])

  // Update QR code
  const [uri, setUri] = useState<string>(getPairingUri(provider.wc.uri))
  useEffect(() => {
    let isCurrent = true

    provider.wc.on('display_uri', (_, { params }) => {
      if (isCurrent) {
        const pairingUri = getPairingUri(params[0])
        setUri(pairingUri)
      }
    })

    return () => {
      isCurrent = false
    }
  }, [provider.wc])

  useEffect(() => {
    if (!isProviderEnabled && !provider.connected) {
      provider.enable()
      isProviderEnabled = true
    }
  }, [provider])

  return { uri }
}

export default usePairing
