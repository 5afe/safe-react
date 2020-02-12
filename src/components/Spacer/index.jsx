// @flow
import * as React from 'react'

type Props = {
  className?: string,
}

const style = {
  flexGrow: 1,
}

const Spacer = ({ className }: Props) => <div className={className} style={style} />

export default Spacer
