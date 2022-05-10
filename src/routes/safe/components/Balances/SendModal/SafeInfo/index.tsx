import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { getExplorerInfo, getNativeCurrency } from 'src/config'
import { currentSafeWithNames } from 'src/logic/safe/store/selectors'
import Paragraph from 'src/components/layout/Paragraph'
import Bold from 'src/components/layout/Bold'
import { border, xs } from 'src/theme/variables'
import Block from 'src/components/layout/Block'
import Row from 'src/components/layout/Row'
import PrefixedEthHashInfo from 'src/components/PrefixedEthHashInfo'

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

type SafeInfoProps = {
  text?: string
}

const SafeInfo = ({ text }: SafeInfoProps): React.ReactElement => {
  const { address: safeAddress, ethBalance, name: safeName } = useSelector(currentSafeWithNames)
  const nativeCurrency = getNativeCurrency()

  return (
    <>
      {text && (
        <Row margin="sm">
          <Paragraph color="black400" noMargin size="lg">
            {text}
          </Paragraph>
        </Row>
      )}
      <PrefixedEthHashInfo
        hash={safeAddress}
        name={safeName}
        strongName
        explorerUrl={getExplorerInfo(safeAddress)}
        showAvatar
        showCopyBtn
      />
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
