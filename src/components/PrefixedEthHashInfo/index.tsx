import { EthHashInfo } from '@gnosis.pm/safe-react-components'
import { ReactElement } from 'react'
import { useSelector } from 'react-redux'
import { copyShortNameSelector, showShortNameSelector } from 'src/logic/appearance/selectors'
import { extractShortChainName } from 'src/routes/routes'
import getAddressWithoutNetworkPrefix from 'src/utils/getAddressWithoutNetworkPrefix'

type Props = Omit<Parameters<typeof EthHashInfo>[0], 'shouldShowShortName' | 'shouldCopyShortName'>

const PrefixedEthHashInfo = ({ hash, ...rest }: Props): ReactElement => {
  const showChainPrefix = useSelector(showShortNameSelector)
  const copyChainPrefix = useSelector(copyShortNameSelector)

  return (
    <EthHashInfo
      hash={getAddressWithoutNetworkPrefix(hash)}
      shortName={extractShortChainName()}
      shouldShowShortName={showChainPrefix}
      shouldCopyShortName={copyChainPrefix}
      {...rest}
    />
  )
}

export default PrefixedEthHashInfo
