import { useState, useEffect, useCallback } from 'react'
import { loadFromStorage, saveToStorage } from 'src/utils/storage'

const APPS_LEGAL_CONSENT_RECEIVED = 'APPS_LEGAL_CONSENT_RECEIVED'

const useLegalConsent = (): { consentReceived: boolean | undefined; onConsentReceipt: () => void } => {
  const [consentReceived, setConsentReceived] = useState<boolean | undefined>()

  useEffect(() => {
    setConsentReceived(loadFromStorage(APPS_LEGAL_CONSENT_RECEIVED) || false)
  }, [])

  const onConsentReceipt = useCallback((): void => {
    setConsentReceived(true)
    saveToStorage(APPS_LEGAL_CONSENT_RECEIVED, true)
  }, [])

  return { consentReceived, onConsentReceipt }
}

export { useLegalConsent }
