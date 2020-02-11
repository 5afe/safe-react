// @flow
import * as React from 'react'

type Props = {
  className?: string,
}

const style = {
  flexGrow: 1,
}

export default ({ className }: Props) => <div className={className} style={style} />
