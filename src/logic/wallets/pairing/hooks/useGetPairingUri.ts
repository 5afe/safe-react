import { getPairingUri } from 'src/logic/wallets/pairing/utils'
import { useEffect, useState } from 'react'

export const useGetPairingUri = (): string | undefined => {
  const onboardUri = getPairingUri()
  const [uri, setUri] = useState<string>()

  useEffect(() => {
    setUri(onboardUri)
  }, [onboardUri])

  return uri
}
