import * as React from 'react'
import styled from 'styled-components'
import Col from 'src/components/layout/Col'
import Paragraph from 'src/components/layout/Paragraph'
import { getNetworkInfo } from 'src/config'
import { border, md, screenSm, sm, xs, fontColor } from 'src/theme/variables'
import { NetworkInfo, NetworkSettings } from 'src/config/networks/network'

const currentNetworkInfo = getNetworkInfo()

const StyledCol = styled(Col)`
  flex-grow: 0;
  padding: 0 ${sm};
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

const NetworkLabel = ({ networkInfo }: { networkInfo?: NetworkInfo }): React.ReactElement => {
  const selectedNetwork = networkInfo || currentNetworkInfo

  return (
    <StyledCol middle="xs" start="xs">
      <StyledParagraph network={selectedNetwork} size="xs">
        {selectedNetwork.label}
      </StyledParagraph>
    </StyledCol>
  )
}

export default NetworkLabel
