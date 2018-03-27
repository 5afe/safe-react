// @flow
import * as React from 'react'

type Props = {
  children: React$Node,
}

const Step = ({ children }: Props) => (
  <div>
    {children}
  </div>
)

export default Step
