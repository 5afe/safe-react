import React, { ReactElement } from 'react'

import { AddressInfo } from './AddressInfo'
import { InfoDetails } from './InfoDetails'

type TxInfoDetailsProps = {
  title: string
  address: string
  addressActions?: any[]
}

export const TxInfoDetails = ({ title, address }: TxInfoDetailsProps): ReactElement => (
  <InfoDetails title={title}>
    <AddressInfo address={address} />
  </InfoDetails>
)
