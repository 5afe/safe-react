import { EthHashInfo } from '@gnosis.pm/safe-react-components'
import React, { ReactElement } from 'react'
import { useSelector } from 'react-redux'

import { getExplorerInfo } from 'src/config'
import { addressBookEntryName } from 'src/logic/addressBook/store/selectors'
import { ADDRESS_BOOK_DEFAULT_NAME } from 'src/logic/addressBook/model/addressBook'
import { sameString } from 'src/utils/strings'

import DataDisplay from './DataDisplay'

interface AddressInfoProps {
  address: string
  title?: string
}

const AddressInfo = ({ address, title }: AddressInfoProps): ReactElement => {
  const name = useSelector((state) => addressBookEntryName(state, { address }))
  const explorerUrl = getExplorerInfo(address)

  return (
    <DataDisplay title={title}>
      <EthHashInfo
        hash={address}
        name={sameString(name, ADDRESS_BOOK_DEFAULT_NAME) ? undefined : name}
        showCopyBtn
        showAvatar
        textSize="lg"
        explorerUrl={explorerUrl}
      />
    </DataDisplay>
  )
}

export default AddressInfo
