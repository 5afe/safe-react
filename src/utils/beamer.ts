import { BEAMER_ID } from './constants'
import { MutableRefObject } from 'react'
import { BeamerConfig } from 'src/types/Beamer'

const BEAMER_URL = 'https://app.getbeamer.com/js/beamer-embed.js'

const APP_ID = BEAMER_ID
const baseConfig: BeamerConfig = {
  product_id: APP_ID,
}

export const loadBeamer = async (scriptRef: MutableRefObject<HTMLScriptElement | undefined>): Promise<void> => {
  if (!APP_ID) {
    console.error('[Beamer] - In order to use Beamer you need to add an appID')
    return
  }

  window.beamer_config = {
    ...baseConfig,
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
    ...baseConfig,
    selector: undefined,
  })
  scriptRef.current.remove()
}
