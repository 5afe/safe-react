import { ReactElement } from 'react'
import Dot from '@material-ui/icons/FiberManualRecord'
import { ETHEREUM_NETWORK } from 'src/types/network.d'
import { AppReduxState } from 'src/store'
import { getNetworkById } from 'src/logic/config/store/selectors'
import { useSelector } from 'react-redux'

type Props = {
  networkId: ETHEREUM_NETWORK
  className?: string
}

export const CircleDot = ({ networkId, className }: Props): ReactElement => {
  const network = useSelector((state: AppReduxState) => getNetworkById(state, networkId))
  return <Dot htmlColor={network.theme.backgroundColor || '#FF685E'} className={className} />
}
