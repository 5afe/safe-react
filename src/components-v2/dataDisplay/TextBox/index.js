// 
import React from 'react'
import styled from 'styled-components'

import { border } from 'theme/variables'


const Box = styled.p`
  padding: 10px;
  word-wrap: break-word;
  border: solid 2px ${border};
`

const TextBox = ({ children }) => {
  return <Box>{children}</Box>
}

export default TextBox
