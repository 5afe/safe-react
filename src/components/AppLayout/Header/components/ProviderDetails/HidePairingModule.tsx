import { useEffect } from 'react'

const HIDE_PAIRING_STYLE = '.bn-onboard-modal-select-wallets li:first-of-type {display: none;}'

const HidePairingModule = (): null => {
  useEffect(() => {
    const style = document.createElement('style')
    style.innerHTML = HIDE_PAIRING_STYLE
    document.head.appendChild(style)

    return () => {
      style.remove()
    }
  }, [])

  return null
}

export default HidePairingModule
