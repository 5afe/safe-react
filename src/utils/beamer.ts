import { BEAMER_ID } from './constants'
import { MutableRefObject } from 'react'
import { BeamerConfig } from 'src/types/Beamer'
import { Cookie } from 'src/logic/cookies/utils'

export const BEAMER_COOKIE_LIST: Cookie[] = [
  { name: `_BEAMER_LAST_POST_SHOWN_${BEAMER_ID}`, path: '/' },
  { name: `_BEAMER_DATE_${BEAMER_ID}`, path: '/' },
  { name: `_BEAMER_FIRST_VISIT_${BEAMER_ID}`, path: '/' },
  { name: `_BEAMER_USER_ID_${BEAMER_ID}`, path: '/' },
  { name: `_BEAMER_FILTER_BY_URL_${BEAMER_ID}`, path: '/' },
]

const BEAMER_URL = 'https://app.getbeamer.com/js/beamer-embed.js'

const baseConfig: BeamerConfig = {
  product_id: BEAMER_ID,
}

export const loadBeamer = async (scriptRef: MutableRefObject<HTMLScriptElement | undefined>): Promise<void> => {
  if (!BEAMER_ID) {
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
  const firstScript = document.getElementsByTagName('script')[0]
  firstScript?.parentNode?.insertBefore(scriptRef.current, firstScript)

  scriptRef.current.addEventListener('load', () => window.Beamer?.init(), { once: true })
}

export const closeBeamer = (scriptRef: MutableRefObject<HTMLScriptElement | undefined>): void => {
  if (!window.Beamer || !scriptRef.current) return
  window.Beamer.destroy()
  scriptRef.current.remove()
}
