import { BEAMER_ID } from './constants'
import { removeCookies } from 'src/logic/cookies/utils'
import local from './storage/local'

const BEAMER_COOKIES = [
  '_BEAMER_LAST_POST_SHOWN_',
  '_BEAMER_DATE_',
  '_BEAMER_FIRST_VISIT_',
  '_BEAMER_USER_ID_',
  '_BEAMER_FILTER_BY_URL_',
  '_BEAMER_LAST_UPDATE_',
  '_BEAMER_BOOSTED_ANNOUNCEMENT_DATE_',
]

export const BEAMER_LS_RE = /^_BEAMER_/

const BEAMER_URL = 'https://app.getbeamer.com/js/beamer-embed.js'

// Beamer script tag singleton
let scriptRef: HTMLScriptElement | null = null

export const loadBeamer = async (): Promise<void> => {
  if (!BEAMER_ID) {
    console.warn('[Beamer] - In order to use Beamer you need to add an appID')
    return
  }

  window.beamer_config = {
    product_id: BEAMER_ID,
    selector: 'whats-new-button',
    display: 'left',
    button: false,
    bounce: false,
  }

  scriptRef = document.createElement('script')
  scriptRef.type = 'text/javascript'
  scriptRef.defer = true
  scriptRef.src = BEAMER_URL
  const firstScript = document.getElementsByTagName('script')[0]
  firstScript?.parentNode?.insertBefore(scriptRef, firstScript)

  scriptRef.addEventListener('load', () => window.Beamer?.init(), { once: true })
}

export const unloadBeamer = (): void => {
  if (!window.Beamer || !scriptRef) return

  window.Beamer.destroy()
  scriptRef.remove()
  scriptRef = null

  setTimeout(() => {
    local.removeMatching(BEAMER_LS_RE)
    removeCookies(BEAMER_COOKIES.map((prefix) => ({ path: '/', name: `${prefix}${BEAMER_ID}` })))
  }, 100)
}
