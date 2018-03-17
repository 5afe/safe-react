// @flow
import React from 'react'
import Col from '~/components/layout/Col'
import Span from '~/components/layout/Span'
import Row from '~/components/layout/Row'
import Img from '~/components/layout/Img'
import { upperFirst } from '~/utils/css'

const logo = require('./gnosis_logo.svg')
const IconParity = require('./icon_parity.svg')
const IconMetamask = require('./icon_metamask.svg')

type Props = {
  provider?: string,
}

const PROVIDER_METAMASK = 'METAMASK'
const PROVIDER_PARITY = 'PARITY'

const PROVIDER_ICONS = {
  [PROVIDER_METAMASK]: IconMetamask,
  [PROVIDER_PARITY]: IconParity,
}

const Connected = ({ provider }: string) => (
  <React.Fragment>
    <Img
      height={40}
      src={PROVIDER_ICONS[provider]}
      title={`You are using ${upperFirst(provider.toLowerCase())} to connect to your Safe`}
    />
    <Span>Connected</Span>
  </React.Fragment>
)

const NotConnected = () => <Span>Not Connected</Span>

const Header = ({ provider }: Props) => {
  const connected = !!provider && PROVIDER_ICONS[provider]
  return (
    <Row>
      <Col xs={12} center="xs" sm={6} start="sm" margin="lg">
        <Img src={logo} height={40} />
      </Col>
      <Col xs={12} center="xs" sm={6} end="sm" margin="lg">
        { connected ? <Connected provider={provider} /> : <NotConnected /> }
      </Col>
    </Row>
  )
}


export default Header
