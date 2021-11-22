import { useHistory } from 'react-router-dom'

import { useSafeAppUrl } from 'src/logic/hooks/useSafeAppUrl'
import AppFrame from 'src/routes/safe/components/Apps/components/AppFrame'
import AppsList from 'src/routes/safe/components/Apps/components/AppsList'
import LegalDisclaimer from 'src/routes/safe/components/Apps/components/LegalDisclaimer'
import { useLegalConsent } from 'src/routes/safe/components/Apps/hooks/useLegalConsent'

const Apps = (): React.ReactElement => {
  const history = useHistory()
  const { getAppUrl } = useSafeAppUrl()
  const url = getAppUrl()
  const { consentReceived, onConsentReceipt } = useLegalConsent()

  const goBack = () => history.goBack()

  if (url) {
    if (!consentReceived) {
      return <LegalDisclaimer onCancel={goBack} onConfirm={onConsentReceipt} />
    }

    return <AppFrame appUrl={url} />
  } else {
    return <AppsList />
  }
}

export default Apps
