import { ReactElement } from 'react'
import SafeLogo from '../assets/transition-logo.png'

const AnimatedLogo = (): ReactElement => {
  return <img alt="Safe" src={`${SafeLogo}`} id="safe-logo" height={36} />
}

export default AnimatedLogo
