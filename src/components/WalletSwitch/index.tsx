import { ReactElement } from 'react'
import { getNetworkId } from 'src/config'
import { Button } from '@material-ui/core'
import { Text } from '@gnosis.pm/safe-react-components'
import { switchWalletChain } from 'src/logic/wallets/utils/network'
import ChainIndicator from 'src/components/ChainIndicator'

const WalletSwitch = (): ReactElement => {
  return (
    <Button variant="outlined" size="medium" color="primary" onClick={switchWalletChain}>
      <Text size="lg">
        Switch wallet to <ChainIndicator chainId={getNetworkId()} />
      </Text>
    </Button>
  )
}

export default WalletSwitch
