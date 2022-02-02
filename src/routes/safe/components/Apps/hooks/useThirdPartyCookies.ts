import { useState, useEffect, useRef, useCallback } from 'react'

const createIframe = (uri: string, onload: () => void): HTMLIFrameElement => {
  const iframeElement: HTMLIFrameElement = document.createElement('iframe')

  iframeElement.src = uri
  iframeElement.setAttribute('style', 'display:none')
  iframeElement.onload = onload
  return iframeElement
}

type ThirdPartyCookiesType = {
  thirdPartyCookiesDisabled: boolean
  setThirdPartyCookiesDisabled: (boolean) => void
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
    window.addEventListener('message', messageHandler)

    const iframeElement: HTMLIFrameElement = createIframe('https://third-party-cookies-test.vercel.app', () => {
      iframeElement?.contentWindow?.postMessage({ test: 'cookie' }, '*')
    })

    iframeRef.current = iframeElement
    document.body.appendChild(iframeElement)
  }, [messageHandler])

  return { thirdPartyCookiesDisabled, setThirdPartyCookiesDisabled }
}

export { useThirdPartyCookies }
