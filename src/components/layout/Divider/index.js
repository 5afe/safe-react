// @flow
import * as React from 'react'
import { border } from '~/theme/variables'

const style = {
  height: '100%',
  borderRight: `solid 2px ${border}`,
}

const Divider = () => <div style={style} />

export default Divider
