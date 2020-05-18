// 
import React from 'react'
import styled from 'styled-components'

import ArrowDown from './arrow-down.svg'

import Hairline from '~/components/layout/Hairline'
import { md, sm } from '~/theme/variables'

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  margin: ${md} 0;

  img {
    margin: 0 ${sm};
  }
`


const DividerLine = ({ withArrow }) => (
  <Wrapper>
    {withArrow && <img alt="Arrow Down" src={ArrowDown} />}
    <Hairline />
  </Wrapper>
)

export default DividerLine
