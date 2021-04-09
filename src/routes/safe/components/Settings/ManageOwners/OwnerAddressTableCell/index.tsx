import * as React from 'react'
import { ReactElement } from 'react'

import { EthHashInfo } from '@gnosis.pm/safe-react-components'
import Block from 'src/components/layout/Block'
import { getExplorerInfo } from 'src/config'

type OwnerAddressTableCellProps = {
  address: string
  knownAddress?: boolean
  showLinks: boolean
  userName?: string
}

export const OwnerAddressTableCell = (props: OwnerAddressTableCellProps): ReactElement => {
  const { address, userName } = props

  return (
    <Block justify="left">
      <EthHashInfo hash={address} name={userName} showCopyBtn showAvatar explorerUrl={getExplorerInfo(address)} />
    </Block>
  )
}
