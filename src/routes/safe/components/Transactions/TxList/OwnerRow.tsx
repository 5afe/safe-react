import { EthHashInfo } from '@gnosis.pm/safe-react-components'
import React, { ReactElement } from 'react'
import { useSelector } from 'react-redux'

import { getExplorerInfo } from 'src/config'
import { getNameFromAddressBookSelector } from 'src/logic/addressBook/store/selectors'

export const OwnerRow = ({ ownerAddress }: { ownerAddress: string }): ReactElement => {
  const ownerName = useSelector((state) => getNameFromAddressBookSelector(state, ownerAddress))

  return (
    <EthHashInfo
      hash={ownerAddress}
      name={ownerName === 'UNKNOWN' ? '' : ownerName}
      showIdenticon
      showCopyBtn
      explorerUrl={getExplorerInfo(ownerAddress)}
      shortenHash={4}
      className="owner-info"
    />
  )
}
