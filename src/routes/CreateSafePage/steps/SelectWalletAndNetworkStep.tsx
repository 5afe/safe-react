import { ReactElement, useState, useCallback } from 'react'
import { useSelector } from 'react-redux'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import DialogContent from '@material-ui/core/DialogContent'
import List from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'
import styled from 'styled-components'

import Block from 'src/components/layout/Block'
import { ChainId } from 'src/config/chain.d'
import { setChainId } from 'src/logic/config/utils'
import { lg } from 'src/theme/variables'
import NetworkLabel from 'src/components/NetworkLabel/NetworkLabel'
import Paragraph from 'src/components/layout/Paragraph'
import { availableSelector, shouldSwitchWalletChain } from 'src/logic/wallets/store/selectors'
import WalletSwitch from 'src/components/WalletSwitch'
import { getChains } from 'src/config/cache/chains'
import ConnectDetails from 'src/components/AppLayout/Header/components/ProviderDetails/ConnectDetails'

export const selectWalletAndNetworkStepLabel = 'Connect wallet & select network'

function SelectWalletAndNetworkStep(): ReactElement {
  const [isNetworkSelectorPopupOpen, setIsNetworkSelectorPopupOpen] = useState(false)
  const isWalletConnected = !!useSelector(availableSelector)
  const isWrongNetwork = useSelector(shouldSwitchWalletChain)

  function openNetworkSelectorPopup() {
    setIsNetworkSelectorPopupOpen(true)
  }

  const onNetworkSwitch = useCallback((chainId: ChainId) => {
    setChainId(chainId)
    setIsNetworkSelectorPopupOpen(false)
  }, [])

  return (
    <Container data-testid={'select-network-step'}>
      {isWalletConnected ? (
        <>
          {!isWrongNetwork && (
            <Paragraph color="#06fc99" noMargin size="lg">
              Wallet connected.
            </Paragraph>
          )}

          <Paragraph color="#06fc99" size="lg" noMargin={isWrongNetwork}>
            Creating a Safe on&nbsp;
            <NetworkLabel onClick={openNetworkSelectorPopup} data-testid="switch-network-link" />
          </Paragraph>
        </>
      ) : (
        <Paragraph color="#06fc99" noMargin size="lg">
          In order to create your Safe, you need to connect a wallet
        </Paragraph>
      )}

      {!isWalletConnected && (
        <WalletContainer>
          <ConnectDetails />
        </WalletContainer>
      )}

      {isWalletConnected && isWrongNetwork && (
        <Paragraph color="#06fc99" size="lg">
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
            {getChains().map((network) => (
              <NetworkLabelItem key={network.chainId} role="button" onClick={() => onNetworkSwitch(network.chainId)}>
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
  background-color: black;
  border-radius: 10px;
`

const WalletContainer = styled.div`
  padding: 30px 0;
  padding-left: 45px;

  > button {
    margin: auto;
  }
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
