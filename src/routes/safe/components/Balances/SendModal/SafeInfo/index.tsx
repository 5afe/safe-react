import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { getExplorerInfo, getNativeCurrency } from 'src/config'
import { currentSafeWithNames } from 'src/logic/safe/store/selectors'
import Paragraph from 'src/components/layout/Paragraph'
import { grey500 } from 'src/theme/variables'
import Block from 'src/components/layout/Block'
import Row from 'src/components/layout/Row'
import PrefixedEthHashInfo from 'src/components/PrefixedEthHashInfo'
import Img from '../../../../../../components/layout/Img'

const BalanceWrapper = styled.div`
  width: 100%;
  text-align: center;
`

const StyledBlock = styled(Block)`
  background-color: ${grey500};
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;

  & img {
    width: 26px;
  }
`

type SafeInfoProps = {
  text?: string
}

const SafeInfo = ({ text }: SafeInfoProps): React.ReactElement => {
  const { address: safeAddress, ethBalance, name: safeName } = useSelector(currentSafeWithNames)
  const nativeCurrency = getNativeCurrency()

  return (
    <>
      {ethBalance && (
        <Row margin="md">
          <BalanceWrapper>
            <StyledBlock>
              <Img src={nativeCurrency.logoUri} />
            </StyledBlock>
            <Paragraph
              data-testid="current-eth-balance"
              size="xl"
              color="black600"
              noMargin
              style={{ marginTop: '8px' }}
            >{`${ethBalance} ${nativeCurrency.symbol}`}</Paragraph>
          </BalanceWrapper>
        </Row>
      )}
      {text && (
        <Row margin="sm">
          <Paragraph color="black400" noMargin size="md">
            {text}
          </Paragraph>
        </Row>
      )}
      <PrefixedEthHashInfo
        hash={safeAddress}
        name={safeName}
        explorerUrl={getExplorerInfo(safeAddress)}
        showAvatar
        showCopyBtn
      />
    </>
  )
}

export default SafeInfo
