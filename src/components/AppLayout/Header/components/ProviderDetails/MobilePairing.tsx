import { lazy, ReactElement } from 'react'
import { isPairingSupported } from 'src/logic/wallets/pairing/utils'
import { wrapInSuspense } from 'src/utils/wrapInSuspense'
import { retry } from 'src/utils/retry'

const PairingDetails = lazy(() =>
  retry(() => import('src/components/AppLayout/Header/components/ProviderDetails/PairingDetails')),
)

const MobilePairing = (props: { vertical?: boolean }): ReactElement | null => {
  return isPairingSupported() ? wrapInSuspense(<PairingDetails {...props} />) : null
}

export default MobilePairing
