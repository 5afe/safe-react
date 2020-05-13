// @flow
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
type Props = {
  size?: number,
  centered?: boolean,
}

const Loader = ({ centered = true, size = 60 }: Props) => (
  <Wrapper centered={centered}>
    <CircularProgress size={size} />
  </Wrapper>
)

export default Loader
