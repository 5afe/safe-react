import * as React from 'react'

class Bold extends React.PureComponent<any> {
  render(): React.ReactElement {
    const { children, ...props } = this.props

    return <b {...props}>{children}</b>
  }
}

export default Bold
