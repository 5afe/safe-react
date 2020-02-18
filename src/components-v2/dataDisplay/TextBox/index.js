// @flow
import React from 'react'
import styled from 'styled-components'

import { border } from '~/theme/variables'

type Props = {
  children: React.Node,
}

const Box = styled.p`
  padding: 10px;
  word-wrap: break-word;
  border: solid 2px ${border};
`

const TextBox = ({ children }: Props) => {
  return <Box>{children}</Box>
}

export default TextBox
