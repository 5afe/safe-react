import React from 'react'
import styled from 'styled-components'

import { CircleDot } from 'src/components/AppLayout/Header/components/CircleDot'
import { getChainById } from 'src/config'
import { ChainId } from 'src/config/chain.d'

interface Props {
  chainId: ChainId
  hideCircle?: boolean
}

const Wrapper = styled.span`
  & > svg {
    font-size: 1.08em;
    vertical-align: text-bottom;
    margin-right: 0.15em;
  }
`

const ChainIndicator = ({ chainId, hideCircle }: Props): React.ReactElement => {
  return (
    <Wrapper>
      {!hideCircle && <CircleDot networkId={chainId} />}
      {getChainById(chainId).chainName}
    </Wrapper>
  )
}

export default ChainIndicator
