// @flow
import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
`

const Loader = () => (
  <Wrapper>
    <CircularProgress size={60} />
  </Wrapper>
)

export default Loader
