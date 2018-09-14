// @flow
import * as React from 'react'
import { type Size, getSize } from '~/theme/size'
import { border } from '~/theme/variables'

const calculateStyleFrom = (margin: Size) => ({
  width: '100%',
  height: '1px',
  backgroundColor: border,
  margin: `${getSize(margin)} 0px`,
})

type Props = {
  margin?: Size,
}

const Hairline = ({ margin }: Props) => {
  const style = calculateStyleFrom(margin)

  return <div style={style} />
}

export default Hairline
