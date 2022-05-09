import { ReactElement } from 'react'
import styled from 'styled-components'

import ConnectButton from 'src/components/ConnectButton'
import MobilePairing from 'src/components/AppLayout/Header/components/ProviderDetails/MobilePairing'

const StyledContainer = styled.div<{
  $vertical: boolean
}>`
  display: flex;
  flex-wrap: wrap;
  gap: ${(props) => (props.$vertical ? '24px' : '60px')};
  box-sizing: border-box;
  justify-content: space-between;
`

const ConnectDetails = ({ vertical = false }: { vertical?: boolean }): ReactElement => (
  <StyledContainer $vertical={vertical}>
    <ConnectButton data-testid="heading-connect-btn" />

    <MobilePairing vertical={vertical} />
  </StyledContainer>
)

export default ConnectDetails
