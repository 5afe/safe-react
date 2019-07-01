// @flow
import * as React from 'react'

type Props = {
  children: React.Node,
}

class Span extends React.PureComponent<Props> {
  render() {
    const { children, ...props } = this.props

    return <span {...props}>{children}</span>
  }
}

export default Span
