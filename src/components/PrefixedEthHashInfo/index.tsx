import { EthHashInfo } from '@gnosis.pm/safe-react-components'
import { ReactElement } from 'react'
import { useSelector } from 'react-redux'
import { copyShortNameSelector, showShortNameSelector } from 'src/logic/appearance/selectors'
import useSafeAddress from 'src/logic/currentSession/hooks/useSafeAddress'
import { parsePrefixedAddress } from 'src/utils/prefixedAddress'
import styled from 'styled-components'

type Props = Omit<Parameters<typeof EthHashInfo>[0], 'shouldShowShortName' | 'shouldCopyShortName'>

const StyledEthHashInfo = styled(EthHashInfo)`
p, span {
    color: #06fc99;
    font-family: monospace;
};
`

const PrefixedEthHashInfo = ({ hash, ...rest }: Props): ReactElement => {
  const showChainPrefix = useSelector(showShortNameSelector)
  const copyChainPrefix = useSelector(copyShortNameSelector)
  const { address } = parsePrefixedAddress(hash)
  const { shortName } = useSafeAddress()

  return (
    <StyledEthHashInfo
      hash={address}
      shortName={shortName}
      shouldShowShortName={showChainPrefix}
      shouldCopyShortName={copyChainPrefix}
      {...rest}
    />
  )
}

export default PrefixedEthHashInfo
