// @flow
import * as React from 'react'

type Props = {
  className?: string,
}

const style = {
  flexGrow: 1,
}

// eslint-disable-next-line react/display-name
export default ({ className }: Props) => <div className={className} style={style} />
