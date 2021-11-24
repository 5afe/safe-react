import { ReactElement, useState, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { ButtonLink } from '@gnosis.pm/safe-react-components'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import DialogContent from '@material-ui/core/DialogContent'
import List from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'
import styled from 'styled-components'

import Block from 'src/components/layout/Block'
import { getNetworks } from 'src/config'
import { lg } from 'src/theme/variables'
import NetworkLabel from 'src/components/NetworkLabel/NetworkLabel'
import Paragraph from 'src/components/layout/Paragraph'
import { providerNameSelector, shouldSwitchWalletChain } from 'src/logic/wallets/store/selectors'
import ConnectButton from 'src/components/ConnectButton'
import { ETHEREUM_NETWORK } from 'src/config/networks/network'
import { setNetwork } from 'src/logic/config/utils'
import WalletSwitch from 'src/components/WalletSwitch'

export const selectWalletAndNetworkStepLabel = 'Connect wallet & select network'

function SelectWalletAndNetworkStep(): ReactElement {
  const [isNetworkSelectorPopupOpen, setIsNetworkSelectorPopupOpen] = useState(false)
  const isWalletConnected = !!useSelector(providerNameSelector)
  const isWrongNetwork = useSelector(shouldSwitchWalletChain)

  function openNetworkSelectorPopup() {
    setIsNetworkSelectorPopupOpen(true)
  }

  const networks = getNetworks()

  const onNetworkSwitch = useCallback((networkId: ETHEREUM_NETWORK) => {
    setNetwork(networkId)
    setIsNetworkSelectorPopupOpen(false)
  }, [])

  return (
    <Container data-testid={'select-network-step'}>
      {isWalletConnected ? (
        <Paragraph color="primary" noMargin size="lg">
          Select network on which to create your Safe. The app is currently pointing to{' '}
          <NetworkLabel onClick={openNetworkSelectorPopup} />
        </Paragraph>
      ) : (
        <Paragraph color="primary" noMargin size="lg">
          In order to select the network to create your Safe, you need to connect a wallet
        </Paragraph>
      )}

      <SwitchNetworkContainer>
        {isWalletConnected ? (
          <ButtonLink
            type="button"
            onClick={openNetworkSelectorPopup}
            color="primary"
            data-testid={'switch-network-link'}
          >
            Switch Network
          </ButtonLink>
        ) : (
          <ConnectButton data-testid="heading-connect-btn" />
        )}
      </SwitchNetworkContainer>

      {isWalletConnected && isWrongNetwork && (
        <Paragraph color="primary" size="lg">
          Your wallet connection must match the selected network. <WalletSwitch />
        </Paragraph>
      )}

      <Dialog
        onClose={() => setIsNetworkSelectorPopupOpen(false)}
        aria-labelledby="select-network"
        data-testid={'select-network-popup'}
        open={isNetworkSelectorPopupOpen}
      >
        <StyledDialogTitle disableTypography>
          <Typography variant={'h5'}>Select Network</Typography>
          <IconButton aria-label="close" onClick={() => setIsNetworkSelectorPopupOpen(false)}>
            <CloseIcon />
          </IconButton>
        </StyledDialogTitle>
        <StyledDialogContent dividers>
          <List component="div">
            {networks.map((network) => (
              <NetworkLabelItem key={network.id} role="button" onClick={() => onNetworkSwitch(network.id)}>
                <NetworkLabel networkInfo={network} flexGrow />
              </NetworkLabelItem>
            ))}
          </List>
        </StyledDialogContent>
      </Dialog>
    </Container>
  )
}

const Container = styled(Block)`
  padding: ${lg};
`
const SwitchNetworkContainer = styled.div`
  margin: ${lg};
  display: flex;
  justify-content: center;
`

const StyledDialogTitle = styled(DialogTitle)`
  display: flex;
  justify-content: space-between;
  padding: 16px 24px;
`

const StyledDialogContent = styled(DialogContent)`
  min-width: 500px;
`

const NetworkLabelItem = styled.div`
  display: flex;
  margin: ${lg} auto;
  cursor: pointer;
  max-width: 50%;

  & > span {
    font-size: 13px;
  }
`

export default SelectWalletAndNetworkStep
