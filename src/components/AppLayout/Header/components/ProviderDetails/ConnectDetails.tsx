import { ReactElement } from 'react'
import styled from 'styled-components'

import ConnectButton from 'src/components/ConnectButton'
import MobilePairing from 'src/components/AppLayout/Header/components/ProviderDetails/MobilePairing'

const StyledContainer = styled.div<{
  $vertical: boolean
}>`
  display: flex;
  flex-wrap: wrap;
  background-color: #000;
  box-sizing: border-box;
  justify-content: space-between;
  gap: ${(props) => (props.$vertical ? '20px' : '60px')};
  max-width: ${(props) => (props.$vertical ? '280px' : 'auto')};
  padding: ${(props) => (props.$vertical ? '20px' : '0')};
`

const ConnectDetails = ({ vertical = false }: { vertical?: boolean }): ReactElement => (
  <StyledContainer $vertical={vertical}>
    <ConnectButton data-testid="heading-connect-btn" />
  </StyledContainer>
)

export default ConnectDetails
