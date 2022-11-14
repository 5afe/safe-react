import * as React from 'react'
import styled from 'styled-components'
import { ChainInfo } from '@gnosis.pm/safe-react-gateway-sdk'

import Col from 'src/components/layout/Col'
import Paragraph from 'src/components/layout/Paragraph'
import { getChainInfo } from 'src/config'
import { md, screenSm, sm, xs } from 'src/theme/variables'

const StyledCol = styled(Col)`
  flex-grow: 0;
  padding: 0 ${sm};
  cursor: ${(props) => (props.onClick ? 'pointer' : 'inherit')};
  @media (min-width: ${screenSm}px) {
    padding-left: ${md};
    padding-right: ${md};
  }
`
const StyledParagraph = styled(Paragraph)`
  background-color: #000;
  color: #06fc99;
  border: #06fc99 2px solid;
  border-radius: 5px;
  line-height: normal;
  text-transform: capitalize;
  margin: 0;
  padding: ${xs} ${sm};
  min-width: 50px;
  text-align: center;
`

const NetworkLabel = ({
  networkInfo,
  onClick,
}: {
  networkInfo?: ChainInfo
  onClick?: () => void
}): React.ReactElement => {
  const chain = networkInfo || getChainInfo()

  return (
    <StyledCol middle="xs" start="xs" onClick={onClick}>
      <StyledParagraph size="xs" className="networkLabel">
        {chain.chainName}
      </StyledParagraph>
    </StyledCol>
  )
}

export default NetworkLabel
