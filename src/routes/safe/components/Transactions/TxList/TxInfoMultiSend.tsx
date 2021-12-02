import { ReactElement } from 'react'
import { MultiSend } from '@gnosis.pm/safe-react-gateway-sdk'

import { AddressInfo } from './AddressInfo'
import { InfoDetails } from './InfoDetails'

const TxInfoMultiSend = ({ txInfo }: { txInfo: MultiSend }): ReactElement => {
  return (
    <InfoDetails title="MultiSend contract:">
      <AddressInfo
        address={txInfo?.to.value}
        name={txInfo.to?.name || '⚠️ Unknown address'}
        avatarUrl={txInfo.to?.logoUri || undefined}
      />
    </InfoDetails>
  )
}

export default TxInfoMultiSend
