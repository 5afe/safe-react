import { useSelector } from 'react-redux'
import { EthHashInfo } from '@gnosis.pm/safe-react-components'
import styled from 'styled-components'

import { currentSafeWithNames } from 'src/logic/safe/store/selectors'
import Paragraph from 'src/components/layout/Paragraph'
import Bold from 'src/components/layout/Bold'
import { border, xs } from 'src/theme/variables'
import Block from 'src/components/layout/Block'
import { AppReduxState } from 'src/store'
import { currentBlockExplorerInfo, currentNetwork } from 'src/logic/config/store/selectors'

const StyledBlock = styled(Block)`
  font-size: 12px;
  line-height: 1.08;
  letter-spacing: -0.5px;
  background-color: ${border};
  width: fit-content;
  padding: 5px 10px;
  margin-top: ${xs};
  margin-left: 40px;
  border-radius: 3px;
`

const SafeInfo = (): React.ReactElement => {
  const { address: safeAddress, ethBalance, name: safeName } = useSelector(currentSafeWithNames)
  const explorerUrl = useSelector((state: AppReduxState) => currentBlockExplorerInfo(state, safeAddress))
  const { nativeCurrency } = useSelector(currentNetwork)

  return (
    <>
      <EthHashInfo hash={safeAddress} name={safeName} explorerUrl={explorerUrl} showAvatar showCopyBtn />
      {ethBalance && (
        <StyledBlock>
          <Paragraph noMargin>
            Balance: <Bold data-testid="current-eth-balance">{`${ethBalance} ${nativeCurrency.symbol}`}</Bold>
          </Paragraph>
        </StyledBlock>
      )}
    </>
  )
}

export default SafeInfo
