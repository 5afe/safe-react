// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { BEAMER_ID } from './constants'

export const loadBeamer = async (): Promise<void> => {
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

  const beamerURL = 'https://app.getbeamer.com/js/beamer-embed.js'

  const s = document.createElement('script')
  s.type = 'text/javascript'
  s.defer = true
  s.src = beamerURL
  const x = document.getElementsByTagName('script')[0]
  x?.parentNode?.insertBefore(s, x)

  s.onload = () => {
    ;(window as any).Beamer.init()
  }
}

export const closeBeamer = (): void => {
  if (!window.Beamer) return
  ;(window as any).Beamer.destroy()
  ;(window as any).Beamer.update({
    selector: undefined,
  })
}
