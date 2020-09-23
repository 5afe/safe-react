import { EthHashInfo } from '@gnosis.pm/safe-react-components'
import React from 'react'
import { useSelector } from 'react-redux'

import { getNetwork } from 'src/config'
import { getNameFromAddressBookSelector } from 'src/logic/addressBook/store/selectors'

import DataDisplay from './DataDisplay'

interface AddressInfoProps {
  address: string
  cut?: number
  title?: string
}

const AddressInfo = ({ address, cut = 4, title }: AddressInfoProps): React.ReactElement => {
  const name = useSelector((state) => getNameFromAddressBookSelector(state, address))

  return (
    <DataDisplay title={title}>
      <EthHashInfo
        hash={address}
        name={name !== 'UNKNOWN' ? name : undefined}
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
