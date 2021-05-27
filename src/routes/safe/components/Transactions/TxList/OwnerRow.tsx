import { EthHashInfo } from '@gnosis.pm/safe-react-components'
import React, { ReactElement } from 'react'
import { useSelector } from 'react-redux'

import { getExplorerInfo } from 'src/config'
import { getNameFromAddressBookSelector } from 'src/logic/addressBook/store/selectors'

export const OwnerRow = ({ address }: { address: string }): ReactElement => {
  const ownerName = useSelector((state) => getNameFromAddressBookSelector(state, { address }))

  return (
    <EthHashInfo
      hash={address}
      name={ownerName === 'UNKNOWN' ? '' : ownerName}
      showAvatar
      showCopyBtn
      explorerUrl={getExplorerInfo(address)}
      shortenHash={4}
      className="owner-info"
    />
  )
}
