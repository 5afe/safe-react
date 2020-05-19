//
import CircularProgress from '@material-ui/core/CircularProgress'
import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: ${({ centered }) => (centered ? 'center' : 'start')};
  align-items: center;
`

const Loader = ({ centered = true, size }) => (
  <Wrapper centered={centered}>
    <CircularProgress size={size || 60} />
  </Wrapper>
)

export default Loader
