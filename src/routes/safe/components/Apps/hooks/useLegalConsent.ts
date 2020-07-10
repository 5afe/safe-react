import { useState, useEffect, useCallback } from 'react'
import { loadFromStorage, saveToStorage } from 'src/utils/storage'

const APPS_LEGAL_CONSENT_RECEIVED = 'APPS_LEGAL_CONSENT_RECEIVED'

const useLegalConsent = (): { consentReceived: boolean; onConsentReceipt: () => void } => {
  const [consentReceived, setConsentReceived] = useState<boolean>(false)

  useEffect(() => {
    const checkLegalDisclaimer = async () => {
      const storedConsentReceived = await loadFromStorage(APPS_LEGAL_CONSENT_RECEIVED)

      if (storedConsentReceived) {
        setConsentReceived(true)
      }
    }

    checkLegalDisclaimer()
  }, [])

  const onConsentReceipt = useCallback((): void => {
    setConsentReceived(true)
    saveToStorage(APPS_LEGAL_CONSENT_RECEIVED, true)
  }, [])

  return { consentReceived, onConsentReceipt }
}

export { useLegalConsent }
