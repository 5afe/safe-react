import { lazy, ReactElement } from 'react'
import { isPairingSupported } from 'src/logic/wallets/pairing/utils'
import { wrapInSuspense } from 'src/utils/wrapInSuspense'

const PairingDetails = lazy(() => import('src/components/AppLayout/Header/components/ProviderDetails/PairingDetails'))

const MobilePairing = (props: { vertical?: boolean }): ReactElement | null => {
  return isPairingSupported() ? wrapInSuspense(<PairingDetails {...props} />) : null
}

export default MobilePairing
