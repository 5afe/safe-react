import { EthHashInfo } from '@gnosis.pm/safe-react-components'
import React from 'react'
import { useSelector } from 'react-redux'

import { getNetwork } from 'src/config'
import { getAddressBook } from 'src/logic/addressBook/store/selectors'
import { getNameFromAdbk } from 'src/logic/addressBook/utils'

import DataDisplay from './DataDisplay'

interface AddressInfoProps {
  address: string
  cut?: number
  title?: string
}

const AddressInfo = ({ address, cut = 4, title }: AddressInfoProps): React.ReactElement => {
  const addressBook = useSelector(getAddressBook)

  return (
    <DataDisplay title={title}>
      <EthHashInfo
        hash={address}
        name={addressBook ? getNameFromAdbk(addressBook, address) : ''}
        showCopyBtn
        showEtherscanBtn
        showIdenticon
        textSize="lg"
        network={getNetwork()}
        shortenHash={cut}
      />
    </DataDisplay>
  )
}

export default AddressInfo
