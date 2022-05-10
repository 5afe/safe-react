import { ReactElement } from 'react'
import { Button } from '@material-ui/core'
import { Text } from '@gnosis.pm/safe-react-components'
import { switchWalletChain } from 'src/logic/wallets/utils/network'
import ChainIndicator from 'src/components/ChainIndicator'
import { useSelector } from 'react-redux'
import { currentChainId } from 'src/logic/config/store/selectors'

const WalletSwitch = (): ReactElement => {
  const chainId = useSelector(currentChainId)
  return (
    <Button variant="outlined" size="medium" color="primary" onClick={switchWalletChain}>
      <Text size="lg">
        Switch wallet to <ChainIndicator chainId={chainId} />
      </Text>
    </Button>
  )
}

export default WalletSwitch
