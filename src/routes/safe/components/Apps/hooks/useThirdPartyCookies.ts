import { useState, useEffect, useRef, useCallback } from 'react'

export const THIRD_PARTY_COOKIES_CHECK_URL = 'https://third-party-cookies-check.gnosis-safe.com'
const SHOW_ALERT_TIMEOUT = 10000

const isSafari = (): boolean => {
  return navigator.userAgent.indexOf('Safari') > -1 && navigator.userAgent.indexOf('Chrome') <= -1
}

const createIframe = (uri: string, onload: () => void): HTMLIFrameElement => {
  const iframeElement: HTMLIFrameElement = document.createElement('iframe')

  iframeElement.src = uri
  iframeElement.setAttribute('style', 'display:none')
  iframeElement.onload = onload

  return iframeElement
}

type ThirdPartyCookiesType = {
  thirdPartyCookiesDisabled: boolean
  setThirdPartyCookiesDisabled: (value: boolean) => void
}

const useThirdPartyCookies = (): ThirdPartyCookiesType => {
  const iframeRef = useRef<HTMLIFrameElement>()
  const [thirdPartyCookiesDisabled, setThirdPartyCookiesDisabled] = useState<boolean>(false)

  const messageHandler = useCallback((event: MessageEvent) => {
    const data = event.data

    try {
      if (data.hasOwnProperty('isCookieEnabled')) {
        setThirdPartyCookiesDisabled(!data.isCookieEnabled)
        window.removeEventListener('message', messageHandler)
        document.body.removeChild(iframeRef.current as Node)
      }
    } catch (e) {
      console.error(e)
    }
  }, [])

  useEffect(() => {
    if (isSafari()) {
      return
    }

    window.addEventListener('message', messageHandler)

    const iframeElement: HTMLIFrameElement = createIframe(THIRD_PARTY_COOKIES_CHECK_URL, () =>
      iframeElement?.contentWindow?.postMessage({ test: 'cookie' }, '*'),
    )

    iframeRef.current = iframeElement
    document.body.appendChild(iframeElement)
  }, [messageHandler])

  useEffect(() => {
    let id: ReturnType<typeof setTimeout>

    if (thirdPartyCookiesDisabled) {
      id = setTimeout(() => setThirdPartyCookiesDisabled(false), SHOW_ALERT_TIMEOUT)
    }

    return () => clearTimeout(id)
  }, [thirdPartyCookiesDisabled])

  return { thirdPartyCookiesDisabled, setThirdPartyCookiesDisabled }
}

export { useThirdPartyCookies }
