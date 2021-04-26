import { EthHashInfo } from '@gnosis.pm/safe-react-components'
import React, { ReactElement } from 'react'
import { useSelector } from 'react-redux'

import { getExplorerInfo } from 'src/config'
import { getNameFromAddressBookSelector } from 'src/logic/addressBook/store/selectors'
import { sameString } from 'src/utils/strings'

import DataDisplay from './DataDisplay'

interface AddressInfoProps {
  address: string
  title?: string
}

const AddressInfo = ({ address, title }: AddressInfoProps): ReactElement => {
  const name = useSelector((state) => getNameFromAddressBookSelector(state, address))
  const explorerUrl = getExplorerInfo(address)

  return (
    <DataDisplay title={title}>
      <EthHashInfo
        hash={address}
        name={sameString(name, 'UNKNOWN') ? undefined : name}
        showCopyBtn
        showAvatar
        textSize="lg"
        explorerUrl={explorerUrl}
      />
    </DataDisplay>
  )
}

export default AddressInfo
