import { EthHashInfo } from '@gnosis.pm/safe-react-components'
import React, { ReactElement } from 'react'
import { useSelector } from 'react-redux'

import { getExplorerInfo } from 'src/config'
import { addressBookEntryName } from 'src/logic/addressBook/store/selectors'
import { ADDRESS_BOOK_DEFAULT_NAME } from 'src/logic/addressBook/model/addressBook'
import { sameString } from 'src/utils/strings'

export const OwnerRow = ({ address }: { address: string }): ReactElement => {
  const ownerName = useSelector((state) => addressBookEntryName(state, { address }))

  return (
    <EthHashInfo
      hash={address}
      name={sameString(ownerName, ADDRESS_BOOK_DEFAULT_NAME) ? undefined : ownerName}
      showAvatar
      showCopyBtn
      explorerUrl={getExplorerInfo(address)}
      shortenHash={4}
      className="owner-info"
    />
  )
}
