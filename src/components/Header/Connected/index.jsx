// @flow
import * as React from 'react'
import Img from '~/components/layout/Img'
import Span from '~/components/layout/Span'
import { upperFirst } from '~/utils/css'

const IconParity = require('../assets/icon_parity.svg')
const IconMetamask = require('../assets/icon_metamask.svg')

type Props = {
  provider: string,
}

const PROVIDER_METAMASK = 'METAMASK'
const PROVIDER_PARITY = 'PARITY'

const PROVIDER_ICONS = {
  [PROVIDER_METAMASK]: IconMetamask,
  [PROVIDER_PARITY]: IconParity,
}

const Connected = ({ provider }: Props) => {
  const msg = `You are using ${upperFirst(provider.toLowerCase())} to connect to your Safe`

  return (
    <React.Fragment>
      <Img
        height={40}
        src={PROVIDER_ICONS[provider]}
        title={msg}
        alt={msg}
      />
      <Span>Connected</Span>
    </React.Fragment>
  )
}

export default Connected
