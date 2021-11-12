import { ReactElement } from 'react'
import Dot from '@material-ui/icons/FiberManualRecord'
import { getChainInfoById } from 'src/config'
import { ETHEREUM_NETWORK } from 'src/config/network.d'

type Props = {
  networkId: ETHEREUM_NETWORK
  className?: string
}

export const CircleDot = ({ networkId, className }: Props): ReactElement => (
  <Dot htmlColor={getChainInfoById(networkId)?.theme.backgroundColor || '#FF685E'} className={className} />
)
