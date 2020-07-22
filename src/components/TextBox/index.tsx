import React from 'react'
import styled from 'styled-components'

import { border } from 'src/theme/variables'

const Box = styled.p`
  padding: 10px;
  word-wrap: break-word;
  border: solid 2px ${border};
`

type Props = {
  children: React.ReactNode
  className?: string
}

const TextBox = ({ children, ...rest }: Props): React.ReactElement => {
  return <Box {...rest}>{children}</Box>
}

export default TextBox
