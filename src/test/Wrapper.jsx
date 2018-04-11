// @flow
import * as React from 'react'

type WrapperProps = {
  children: React$Node
}

class Wrapper extends React.PureComponent<WrapperProps> {
  render() {
    return (
      <React.Fragment>
        { this.props.children }
      </React.Fragment>
    )
  }
}

export default Wrapper
