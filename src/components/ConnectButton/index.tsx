import { ReactElement } from 'react'
import styled from 'styled-components'

import Button from 'src/components/layout/Button'
import { KeyRing } from 'src/components/AppLayout/Header/components/KeyRing'
import onboard, { checkWallet } from 'src/logic/wallets/onboard'
import { OVERVIEW_EVENTS } from 'src/utils/events/overview'
import Track from '../Track'

export const onConnectButtonClick = async (): Promise<void> => {
  const walletSelected = await onboard().walletSelect()

  // perform wallet checks only if user selected a wallet
  if (walletSelected) {
    await checkWallet()
  }
}

const StyledContainer = styled.div`
  text-align: center;
  background-color: #000;
`

const StyledTitle = styled.h5`
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.4px;
  margin: 0;
`

const StyledKeyring = styled.div`
  width: 100px;
  margin: 24px auto;
`

const ConnectButton = (props: { 'data-testid': string }): ReactElement => (
  <StyledContainer>
    <StyledTitle>Connect a Wallet</StyledTitle>

    <StyledKeyring>
      <KeyRing center circleSize={60} dotRight={20} dotSize={20} dotTop={50} keySize={28} mode="error" />
    </StyledKeyring>

    <Track {...OVERVIEW_EVENTS.OPEN_ONBOARD}>
      <Button color="primary" minWidth={240} onClick={onConnectButtonClick} variant="contained" {...props}>
        Connect
      </Button>
    </Track>
  </StyledContainer>
)

export default ConnectButton
