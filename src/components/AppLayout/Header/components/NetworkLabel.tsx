import styled from 'styled-components'
import Col from 'src/components/layout/Col'
import Paragraph from 'src/components/layout/Paragraph'
import { border, md, screenSm, sm, xs, fontColor } from 'src/theme/variables'
import { getChainInfo } from 'src/config'
import { ChainInfo } from '@gnosis.pm/safe-react-gateway-sdk'
import { ReactElement } from 'react'

const StyledCol = styled(Col)`
  flex-grow: 0;
  padding: 0 ${sm};
  cursor: ${(props) => (props.onClick ? 'pointer' : 'inherit')};
  @media (min-width: ${screenSm}px) {
    padding-left: ${md};
    padding-right: ${md};
  }
`
const StyledParagraph = styled(Paragraph)<{ chainInfo: ChainInfo }>`
  background-color: ${({ chainInfo }) => chainInfo.theme.backgroundColor ?? border};
  color: ${({ chainInfo }) => chainInfo.theme.textColor ?? fontColor};
  border-radius: 3px;
  line-height: normal;
  text-transform: capitalize;
  margin: 0;
  padding: ${xs} ${sm};
  min-width: 70px;
  text-align: center;
`

const NetworkLabel = ({
  chainInfo = getChainInfo(),
  onClick,
}: {
  chainInfo?: ChainInfo
  onClick?: () => void
}): ReactElement => (
  <StyledCol middle="xs" start="xs" onClick={onClick}>
    <StyledParagraph chainInfo={chainInfo} size="xs">
      {chainInfo.chainName}
    </StyledParagraph>
  </StyledCol>
)

export default NetworkLabel
