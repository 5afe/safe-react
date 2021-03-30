import { EthHashInfo } from '@gnosis.pm/safe-react-components'
import React, { ReactElement } from 'react'
import { useSelector } from 'react-redux'
import { getExplorerInfo } from 'src/config'

import { getNameFromAddressBookSelector } from 'src/logic/addressBook/store/selectors'

type Props = {
  address: string
  name?: string | undefined
  avatarUrl?: string | undefined
}

export const AddressInfo = ({ address, name, avatarUrl }: Props): ReactElement | null => {
  const recipientName = useSelector((state) => getNameFromAddressBookSelector(state, address))

  if (address === '') {
    return null
  }

  return (
    <EthHashInfo
      hash={address}
      name={recipientName === 'UNKNOWN' ? name : recipientName}
      withAvatar={avatarUrl ?? true}
      showCopyBtn
      explorerUrl={getExplorerInfo(address)}
    />
  )
}
