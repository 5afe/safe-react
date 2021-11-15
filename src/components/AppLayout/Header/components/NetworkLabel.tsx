import styled from 'styled-components'
import Col from 'src/components/layout/Col'
import Paragraph from 'src/components/layout/Paragraph'
import { border, md, screenSm, sm, xs, fontColor } from 'src/theme/variables'
import { ChainInfo } from '@gnosis.pm/safe-react-gateway-sdk'
import { ReactElement } from 'react'
import { useSelector } from 'react-redux'
import { currentNetwork } from 'src/logic/config/store/selectors'

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

const NetworkLabel = ({ chainInfo, onClick }: { chainInfo?: ChainInfo; onClick?: () => void }): ReactElement => {
  const network = useSelector(currentNetwork)
  return (
    <StyledCol middle="xs" start="xs" onClick={onClick}>
      <StyledParagraph chainInfo={chainInfo || network} size="xs">
        {chainInfo?.chainName || network.chainName}
      </StyledParagraph>
    </StyledCol>
  )
}

export default NetworkLabel
