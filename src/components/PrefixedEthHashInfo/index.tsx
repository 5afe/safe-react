import { EthHashInfo } from '@gnosis.pm/safe-react-components'
import { ReactElement } from 'react'
import { useSelector } from 'react-redux'
import { copyShortNameSelector, showShortNameSelector } from 'src/logic/appearance/selectors'
import { extractShortChainName } from 'src/routes/routes'

type Props = Omit<Parameters<typeof EthHashInfo>[0], 'shortName' | 'shouldShowShortName' | 'shouldCopyShortName'>

const PrefixedEthHashInfo = ({ hash, ...rest }: Props): ReactElement => {
  const showChainPrefix = useSelector(showShortNameSelector)
  const copyChainPrefix = useSelector(copyShortNameSelector)

  return (
    <EthHashInfo
      hash={hash}
      shortName={extractShortChainName()}
      shouldShowShortName={showChainPrefix}
      shouldCopyShortName={copyChainPrefix}
      {...rest}
    />
  )
}

export default PrefixedEthHashInfo
