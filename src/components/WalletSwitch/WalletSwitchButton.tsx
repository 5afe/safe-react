import { ReactElement } from 'react'
import { getNetworkId } from 'src/config'
import { Button } from '@material-ui/core'
import { Text } from '@gnosis.pm/safe-react-components'
import onboard from 'src/logic/wallets/onboard'
import { switchNetwork } from 'src/logic/wallets/utils/network'
import ChainIndicator from 'src/components/ChainIndicator'

interface WalletSwitchButtonProps {
  text?: string
}

const WalletSwitchButton = ({ text = 'Switch wallet to' }: WalletSwitchButtonProps): ReactElement => {
  const onNetworkChange = async () => {
    const { wallet } = onboard().getState()
    try {
      await switchNetwork(wallet, getNetworkId())
    } catch (e) {
      e.log()
      // Fallback to the onboard popup if switching isn't supported
      await onboard().walletCheck()
    }
  }

  return (
    <Button variant="outlined" size="medium" color="primary" onClick={onNetworkChange}>
      <Text size="lg">
        {text} <ChainIndicator chainId={getNetworkId()} />
      </Text>
    </Button>
  )
}

export default WalletSwitchButton
