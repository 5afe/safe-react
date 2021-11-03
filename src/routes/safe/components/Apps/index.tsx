import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { useSafeAppUrl } from 'src/logic/hooks/useSafeAppUrl'
import { generateSafeRoute, SAFE_ROUTES } from 'src/routes/routes'
import { getCurrentShortChainName } from 'src/config'
import { currentSafe } from 'src/logic/safe/store/selectors'
import AppFrame from 'src/routes/safe/components/Apps/components/AppFrame'
import AppsList from 'src/routes/safe/components/Apps/components/AppsList'
import LegalDisclaimer from 'src/routes/safe/components/Apps/components/LegalDisclaimer'
import { useLegalConsent } from 'src/routes/safe/components/Apps/hooks/useLegalConsent'

const Apps = (): React.ReactElement => {
  const history = useHistory()
  const { address: safeAddress } = useSelector(currentSafe)
  const { getAppUrl } = useSafeAppUrl()
  const url = getAppUrl()
  const { consentReceived, onConsentReceipt } = useLegalConsent()

  const redirectToBalance = () =>
    history.push(generateSafeRoute(SAFE_ROUTES.ASSETS_BALANCES, { shortName: getCurrentShortChainName(), safeAddress }))

  if (url) {
    if (!consentReceived) {
      return <LegalDisclaimer onCancel={redirectToBalance} onConfirm={onConsentReceipt} />
    }

    return <AppFrame appUrl={url} />
  } else {
    return <AppsList />
  }
}

export default Apps
