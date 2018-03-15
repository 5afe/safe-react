// @flow
import React from 'react'
import Block from '~/components/layout/Block'
import Img from '~/components/layout/Img'
import { xl } from '~/theme/variables'

const logo = require('./gnosis_logo.svg')

const imgStyle = {
  paddingTop: xl,
}

const Header = () => (
  <Block>
    <Img src={logo} style={imgStyle} height={50} />
  </Block>
)

export default Header
