import { EthHashInfo } from '@gnosis.pm/safe-react-components'
import React, { ReactElement } from 'react'
import { useSelector } from 'react-redux'
import { getExplorerInfo } from 'src/config'

import { getNameFromAddressBookSelector } from 'src/logic/addressBook/store/selectors'

export const AddressInfo = ({ address }: { address: string }): ReactElement | null => {
  const recipientName = useSelector((state) => getNameFromAddressBookSelector(state, address))

  if (address === '') {
    return null
  }

  return (
    <EthHashInfo
      hash={address}
      name={recipientName === 'UNKNOWN' ? undefined : recipientName}
      showIdenticon
      showCopyBtn
      explorerUrl={getExplorerInfo(address)}
    />
  )
}
