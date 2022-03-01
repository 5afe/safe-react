import { ReactElement } from 'react'

import Button from 'src/components/layout/Button'
import onboard, { checkWallet } from 'src/logic/wallets/onboard'

export const onConnectButtonClick = async (): Promise<void> => {
  const walletSelected = await onboard().walletSelect()

  // perform wallet checks only if user selected a wallet
  if (walletSelected) {
    await checkWallet()
  }
}

const ConnectButton = (props: { 'data-testid': string }): ReactElement => (
  <Button color="primary" minWidth={240} onClick={onConnectButtonClick} variant="contained" {...props}>
    Connect
  </Button>
)

export default ConnectButton
