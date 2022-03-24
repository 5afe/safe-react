import { ReactElement } from 'react'

import Button from 'src/components/layout/Button'
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

const ConnectButton = (props: { 'data-testid': string }): ReactElement => (
  <Track {...OVERVIEW_EVENTS.ONBOARD}>
    <Button color="primary" minWidth={240} onClick={onConnectButtonClick} variant="contained" {...props}>
      Connect
    </Button>
  </Track>
)

export default ConnectButton
