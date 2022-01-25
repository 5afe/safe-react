import React from 'react'
import styled from 'styled-components'

import { CircleDot } from 'src/components/AppLayout/Header/components/CircleDot'
import { getChainById } from 'src/config'
import { ChainId } from 'src/config/chain.d'

interface Props {
  chainId: ChainId
  noLabel?: boolean
  noCircle?: boolean
}

const Wrapper = styled.span`
  & > svg {
    font-size: 1.08em;
    vertical-align: text-bottom;
    margin-right: 0.15em;
  }
}
`

const ChainIndicator = ({ chainId, noLabel, noCircle }: Props): React.ReactElement => {
  return (
    <Wrapper>
      {!noCircle && <CircleDot networkId={chainId} />}
      {!noLabel && getChainById(chainId).chainName}
    </Wrapper>
  )
}

export default ChainIndicator
