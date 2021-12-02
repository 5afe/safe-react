import * as React from 'react'

class Span extends React.PureComponent<any> {
  render(): React.ReactElement {
    const { children, ...props } = this.props

    return <span {...props}>{children}</span>
  }
}

export default Span
