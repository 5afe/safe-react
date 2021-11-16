import { ReactElement } from 'react'
import { getNetworkId } from 'src/config'
import { Button } from '@material-ui/core'
import { Text } from '@gnosis.pm/safe-react-components'
import { switchWalletChain } from 'src/logic/wallets/utils/network'
import ChainIndicator from 'src/components/ChainIndicator'

interface WalletSwitchProps {
  text?: string
  fullWidth?: boolean
}

const WalletSwitch = ({ text = 'Switch wallet to', fullWidth = false }: WalletSwitchProps): ReactElement => {
  return (
    <Button variant="outlined" size="medium" color="primary" onClick={switchWalletChain} fullWidth={fullWidth}>
      <Text size="lg">
        {text} <ChainIndicator chainId={getNetworkId()} />
      </Text>
    </Button>
  )
}

export default WalletSwitch
