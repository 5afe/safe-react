// @flow
import React, { PureComponent } from 'react'

type Props = {
  children: React.Node
}

class Span extends PureComponent<Props> {
  render() {
    const { children, ...props } = this.props

    return (
      <span {...props}>
        { children }
      </span>
    )
  }
}

export default Span
