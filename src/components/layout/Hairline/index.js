// @flow
import * as React from 'react'
import { type Size, getSize } from '~/theme/size'
import { border } from '~/theme/variables'

const calculateStyleFrom = (color?: string, margin?: Size) => ({
  width: '100%',
  height: '1px',
  backgroundColor: color || border,
  margin: `${getSize(margin)} 0px`,
})

type Props = {
  margin?: Size,
  color?: string,
}

const Hairline = ({ margin, color }: Props) => {
  const style = calculateStyleFrom(color, margin)

  return <div style={style} />
}

export default Hairline
