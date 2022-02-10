import { BEAMER_ID } from './constants'
import { MutableRefObject } from 'react'

const BEAMER_URL = 'https://app.getbeamer.com/js/beamer-embed.js'

export const loadBeamer = async (scriptRef: MutableRefObject<HTMLScriptElement | undefined>): Promise<void> => {
  const APP_ID = BEAMER_ID
  if (!APP_ID) {
    console.error('[Beamer] - In order to use Beamer you need to add an appID')
    return
  }

  window.beamer_config = {
    product_id: APP_ID,
    selector: 'whats-new-button',
    display: 'left',
    button: false,
    bounce: false,
  }

  scriptRef.current = document.createElement('script')
  scriptRef.current.type = 'text/javascript'
  scriptRef.current.defer = true
  scriptRef.current.src = BEAMER_URL
  const x = document.getElementsByTagName('script')[0]
  x?.parentNode?.insertBefore(scriptRef.current, x)

  scriptRef.current.onload = () => {
    if (!window.Beamer) return
    window.Beamer.init()
  }
}

export const closeBeamer = (scriptRef: MutableRefObject<HTMLScriptElement | undefined>): void => {
  if (!window.Beamer || !scriptRef.current) return
  window.Beamer.destroy()
  window.Beamer.update({
    selector: undefined,
  })
  scriptRef.current.remove()
}
