import { ReactElement } from 'react'
import { MultiSend } from '@gnosis.pm/safe-react-gateway-sdk'

import PrefixedEthHashInfo from 'src/components/PrefixedEthHashInfo'
import { getExplorerInfo } from 'src/config'

// Does not use AddressInfo as to not allow address book data display
// as we use backend data to verify the deligate call
const TxInfoMultiSend = ({ txInfo }: { txInfo: MultiSend }): ReactElement => {
  const hash = txInfo?.to.value
  const name = txInfo.to?.name || undefined
  const customAvatar = txInfo.to?.logoUri || undefined
  return (
    <PrefixedEthHashInfo
      hash={hash}
      name={name}
      customAvatar={customAvatar}
      showAvatar
      showCopyBtn
      explorerUrl={getExplorerInfo(hash)}
    />
  )
}

export default TxInfoMultiSend
