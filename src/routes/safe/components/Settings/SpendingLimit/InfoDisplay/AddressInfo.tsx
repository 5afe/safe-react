import { EthHashInfo } from '@gnosis.pm/safe-react-components'
import React, { ReactElement } from 'react'
import { useSelector } from 'react-redux'

import { getExplorerInfo } from 'src/config'
import { getNameFromAddressBookSelector } from 'src/logic/addressBook/store/selectors'

import DataDisplay from './DataDisplay'

interface AddressInfoProps {
  address: string
  cut?: number
  title?: string
}

const AddressInfo = ({ address, cut = 4, title }: AddressInfoProps): ReactElement => {
  const name = useSelector((state) => getNameFromAddressBookSelector(state, address))
  const explorerUrl = getExplorerInfo(address)

  return (
    <DataDisplay title={title}>
      <EthHashInfo
        hash={address}
        name={name !== 'UNKNOWN' ? name : undefined}
        showCopyBtn
        showIdenticon
        textSize="lg"
        explorerUrl={explorerUrl}
        shortenHash={cut}
      />
    </DataDisplay>
  )
}

export default AddressInfo
