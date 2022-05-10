import { ReactElement } from 'react'
import { ModuleExecutionDetails } from '@gnosis.pm/safe-react-gateway-sdk'

import { AddressInfo } from './AddressInfo'
import { InfoDetails } from './InfoDetails'

const TxModuleInfo = ({ detailedExecutionInfo }: { detailedExecutionInfo: ModuleExecutionDetails }): ReactElement => {
  const { value, name, logoUri } = detailedExecutionInfo.address

  return (
    <InfoDetails title="Module:">
      <AddressInfo address={value} name={name || undefined} avatarUrl={logoUri || undefined} />
    </InfoDetails>
  )
}

export default TxModuleInfo
