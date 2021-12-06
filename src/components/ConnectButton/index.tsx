import { ReactElement } from 'react'
import Button from 'src/components/layout/Button'
import { _getChainId } from 'src/config'
import { getWeb3 } from 'src/logic/wallets/getWeb3'
import onboard from 'src/logic/wallets/onboard'
import { shouldSwitchNetwork, switchNetwork } from 'src/logic/wallets/utils/network'

const checkWallet = async (): Promise<boolean> => {
  if (shouldSwitchNetwork()) {
    switchNetwork(onboard().getState().wallet, _getChainId()).catch((e) => e.log())
  }

  return await onboard().walletCheck()
}

export const onboardUser = async (): Promise<boolean> => {
  // before calling walletSelect you want to check if web3 has been instantiated
  // which indicates that a wallet has already been selected
  // and web3 has been instantiated with that provider
  const web3 = getWeb3()
  const walletSelected = web3 ? true : await onboard().walletSelect()
  return walletSelected && checkWallet()
}

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
