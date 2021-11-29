import * as React from 'react'
import Dot from '@material-ui/icons/FiberManualRecord'
import { ChainId, getChainById } from 'src/config'

type Props = {
  networkId: ChainId
  className?: string
}

export const CircleDot = (props: Props): React.ReactElement => {
  const { theme } = getChainById(props.networkId)

  return <Dot htmlColor={theme?.backgroundColor || '#FF685E'} className={props.className} />
}
