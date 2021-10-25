import * as React from 'react'
import styled from 'styled-components'
import Col from 'src/components/layout/Col'
import Paragraph from 'src/components/layout/Paragraph'
import { getNetworkInfo } from 'src/config'
import { border, md, screenSm, sm, xs, fontColor } from 'src/theme/variables'
import { NetworkInfo, NetworkSettings } from 'src/config/networks/network'

const StyledCol = styled(Col)`
  flex-grow: 0;
  padding: 0 ${sm};
  cursor: ${(props) => (props.onClick ? 'pointer' : 'inherit')};
  @media (min-width: ${screenSm}px) {
    padding-left: ${md};
    padding-right: ${md};
  }
`
const StyledParagraph = styled(Paragraph)<{ network: Partial<NetworkSettings> }>`
  background-color: ${(props) => props.network?.backgroundColor ?? border};
  color: ${(props) => props.network?.textColor ?? fontColor};
  border-radius: 3px;
  line-height: normal;
  text-transform: capitalize;
  margin: 0;
  padding: ${xs} ${sm};
  min-width: 70px;
  text-align: center;
`

const NetworkLabel = ({
  networkInfo,
  onClick,
}: {
  networkInfo?: NetworkInfo
  onClick?: () => void
}): React.ReactElement => {
  const selectedNetwork = networkInfo || getNetworkInfo()

  return (
    <StyledCol middle="xs" start="xs" onClick={onClick}>
      <StyledParagraph network={selectedNetwork} size="xs">
        {selectedNetwork.label}
      </StyledParagraph>
    </StyledCol>
  )
}

export default NetworkLabel
