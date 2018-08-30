// @flow
import * as React from 'react'
import { border } from '~/theme/variables'

const hairlineStyle = {
  width: '100%',
  height: '2px',
  backgroundColor: border,
  margin: '20px 0px',
}

const Hairline = () => (
  <div style={hairlineStyle} />
)

export default Hairline
