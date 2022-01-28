import { useState, useEffect, useRef } from 'react'

const useThirdPartyCookies = (): { thirdPartyCookiesDisabled: boolean } => {
  const iframeRef = useRef<HTMLIFrameElement>()
  const [thirdPartyCookiesDisabled, setThirdPartyCookiesDisabled] = useState<boolean>(false)

  useEffect(() => {
    const messageHandler = (event) => {
      // check for trusted origins here
      console.log('DATA', event.data)
      try {
        if (event.data.result) {
          console.log('THE DATA:', event.data.result)
          setThirdPartyCookiesDisabled(!event.data.result)
          window.removeEventListener('message', messageHandler)
          document.body.removeChild(iframeRef.current as Node)
        }
      } catch (e) {
        console.error(e)
      }
    }

    window.addEventListener('message', messageHandler)

    const frame: HTMLIFrameElement = document.createElement('iframe')
    iframeRef.current = frame
    frame.src = 'https://r0ucr.csb.app/'
    frame.setAttribute('sandbox', 'allow-scripts allow-same-origin')
    frame.setAttribute('style', 'display:none')
    frame.onload = () => {
      frame?.contentWindow?.postMessage({ test: 'cookie' }, '*')
    }
    document.body.appendChild(frame)
  }, [])

  return { thirdPartyCookiesDisabled }
}

export { useThirdPartyCookies }
