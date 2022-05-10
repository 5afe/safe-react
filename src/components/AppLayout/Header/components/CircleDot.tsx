import * as React from 'react'
import Dot from '@material-ui/icons/FiberManualRecord'
import { getChainById } from 'src/config'
import { ChainId } from 'src/config/chain.d'

type Props = {
  networkId: ChainId
  className?: string
}

export const CircleDot = (props: Props): React.ReactElement => {
  const { theme } = getChainById(props.networkId)

  return <Dot htmlColor={theme?.backgroundColor || '#FF685E'} className={props.className} />
}
