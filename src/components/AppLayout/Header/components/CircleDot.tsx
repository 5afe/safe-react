import * as React from 'react'
import Dot from '@material-ui/icons/FiberManualRecord'

import { getNetworkConfigById } from 'src/config'
import { ETHEREUM_NETWORK } from 'src/config/networks/network'
import rinkeby from 'src/config/networks/rinkeby'

type Props = {
  networkId: ETHEREUM_NETWORK
  className?: string
}

export const CircleDot = (props: Props): React.ReactElement => {
  const networkInfo = getNetworkConfigById(props.networkId)?.network

  return <Dot htmlColor={networkInfo?.backgroundColor || rinkeby.network.backgroundColor} className={props.className} />
}
