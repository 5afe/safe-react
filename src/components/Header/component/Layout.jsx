// @flow
import React from 'react'
import Col from '~/components/layout/Col'
import Img from '~/components/layout/Img'
import Loader from '~/components/Loader'
import Row from '~/components/layout/Row'

import Connected from './Connected'
import NotConnected from './NotConnected'

const logo = require('../assets/gnosis_logo.svg')

type Props = {
  provider: string,
  reloadWallet: Function,
}

const Header = ({ provider, reloadWallet }: Props) => (
  <Row>
    <Col xs={12} center="xs" sm={6} start="sm" margin="lg">
      <Img src={logo} height={40} alt="Gnosis Safe" />
    </Col>
    <Col xs={12} center="xs" sm={6} end="sm" margin="lg">
      { provider ? <Connected provider={provider} /> : <NotConnected /> }
      <Loader callback={reloadWallet} />
    </Col>
  </Row>
)

export default Header
