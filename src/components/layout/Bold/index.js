// @flow
import * as React from 'react'

type Props = {
  children: React.Node,
}

class Bold extends React.PureComponent<Props> {
  render() {
    const { children, ...props } = this.props

    return <b {...props}>{children}</b>
  }
}

export default Bold
