// @flow
import React from 'react'
import Img from '~/components/layout/Img'

const logo = require('./gnosis_logo.svg')

const Header = () => (
  <div>
    <Img src={logo} />
  </div>
)

export default Header
