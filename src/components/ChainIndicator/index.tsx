import { ReactElement } from 'react'
import styled from 'styled-components'

import { CircleDot } from 'src/components/AppLayout/Header/components/CircleDot'
import { ETHEREUM_NETWORK } from 'src/types/network.d'
import { useSelector } from 'react-redux'
import { getNetworkById } from 'src/logic/config/store/selectors'
import { AppReduxState } from 'src/store'

interface Props {
  chainId: ETHEREUM_NETWORK
  noLabel?: boolean
}

const Wrapper = styled.span`
  & > svg {
    font-size: 1.08em;
    vertical-align: text-bottom;
    margin-right: 0.15em;
  }
}
`

const ChainIndicator = ({ chainId, noLabel }: Props): ReactElement => {
  const { chainName } = useSelector((state: AppReduxState) => getNetworkById(state, chainId))
  return (
    <Wrapper>
      <CircleDot networkId={chainId} />
      {!noLabel && chainName}
    </Wrapper>
  )
}

export default ChainIndicator
