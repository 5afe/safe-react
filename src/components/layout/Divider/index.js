// @flow
import * as React from 'react'
import { border } from '~/theme/variables'

type Props = {
  className?: string,
}

const style = {
  borderRight: `solid 2px ${border}`,
  height: '100%',
}

const Divider = ({ className }: Props) => <div className={className} style={style} />

export default Divider
