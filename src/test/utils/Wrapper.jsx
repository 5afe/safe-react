// @flow
import * as React from 'react'

type WrapperProps = {
  children: React$Node,
}

const Wrapper = ({ children }: WrapperProps) => <React.Fragment>{children}</React.Fragment>

export default Wrapper
