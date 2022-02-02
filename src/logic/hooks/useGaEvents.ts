import { useEffect } from 'react'
import { matchPath, useLocation } from 'react-router-dom'

import { useAnalytics } from 'src/utils/googleAnalytics'
import { isDeeplinkedTx } from 'src/routes/safe/components/Transactions/TxList/utils'
import { extractSafeAddress, getPrefixedSafeAddressSlug, SAFE_ROUTES, TRANSACTION_ID_SLUG } from 'src/routes/routes'

const useGaEvents = (): void => {
  const { trackPage } = useAnalytics()
  const location = useLocation()
  const { pathname, search } = location
  // Google Analytics
  useEffect(() => {
    let trackedPath = pathname
    const address = extractSafeAddress()

    // Anonymize safe address
    if (address) {
      trackedPath = trackedPath.replace(getPrefixedSafeAddressSlug(), 'SAFE_ADDRESS')
    }

    // Anonymize deeplinked transaction
    if (isDeeplinkedTx()) {
      const match = matchPath(pathname, {
        path: SAFE_ROUTES.TRANSACTIONS_SINGULAR,
      })

      trackedPath = trackedPath.replace(match?.params[TRANSACTION_ID_SLUG], 'TRANSACTION_ID')
    }

    trackPage(trackedPath + search)
  }, [pathname, search, trackPage])
}

export default useGaEvents
