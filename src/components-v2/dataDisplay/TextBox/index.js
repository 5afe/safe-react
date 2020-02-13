// @flow
import React from 'react'
import styled from 'styled-components'

type Props = {
  children: React.Node,
}

const Box = styled.div`
  padding: 10px;
  word-wrap: break-word;
  border: solid 2px #e8e7e6;
`

const TextBox = ({ children }: Props) => {
  return <Box>{children}</Box>
}

export default TextBox
