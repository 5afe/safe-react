// @flow
import React from 'react'
import styled from 'styled-components'

import Hairline from '~/components/layout/Hairline'
import { sm, md } from '~/theme/variables'
import ArrowDown from './arrow-down.svg'

const Warpper = styled.div`
  display: flex;
  align-items: center;
  margin: ${md} 0;

  img {
    margin: 0 ${sm};
  }
`

type Props = {
  withArrow: boolean,
}

const DividerLine = ({ withArrow }: Props) => (
  <Warpper>
    {withArrow && <img src={ArrowDown} alt="Arrow Down" />}
    <Hairline />
  </Warpper>
)

export default DividerLine
