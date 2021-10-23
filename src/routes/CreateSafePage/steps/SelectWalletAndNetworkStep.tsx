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
import { providerNameSelector } from 'src/logic/wallets/store/selectors'
import ConnectButton from 'src/components/ConnectButton'
import { ETHEREUM_NETWORK } from 'src/config/networks/network'
import { setNetwork } from 'src/logic/config/utils'
import { render } from '@testing-library/react'

export const selectWalletAndNetworkStepLabel = 'Connect wallet & select network'

function SelectWalletAndNetworkStep(): ReactElement {
  const [isNetworkSelectorPopupOpen, setIsNetworkSelectorPopupOpen] = useState(false)
  const isWalletConnected = !!useSelector(providerNameSelector)
  const [isChecked, setIsChecked] = useState(false)

  function openNetworkSelectorPopup() {
    setIsNetworkSelectorPopupOpen(true)
  }

  const networks = getNetworks()
  let networkList = [
    { id: 1, isChecked: false },
    { id: 4, isChecked: false },
    { id: 42, isChecked: false },
    { id: 5, isChecked: false },
    { id: 56, isChecked: false },
    { id: 100, isChecked: false },
    { id: 137, isChecked: false },
    { id: 246, isChecked: false },
    { id: 1285, isChecked: false },
    { id: 1287, isChecked: false },
    { id: 4002, isChecked: false },
    { id: 42161, isChecked: false },
    { id: 42220, isChecked: false },
    { id: 43114, isChecked: false },
    { id: 73799, isChecked: false },
    { id: 33399, isChecked: false },
  ]

  const Checkbox = (props) => <input type="checkbox" {...props} />

  const onNetworkSwitch = useCallback((networkId: ETHEREUM_NETWORK) => {
    setNetwork(networkId)
    setIsNetworkSelectorPopupOpen(false)
  }, [])

  return (
    <Container data-testid={'select-network-step'}>
      {isWalletConnected ? (
        <Paragraph color="primary" noMargin size="lg">
          Select network on which to create your Safe. You will deploy to all chains selected below.
        </Paragraph>
      ) : (
        <Paragraph color="primary" noMargin size="lg">
          In order to select the network to create your Safe, you need to connect a wallet
        </Paragraph>
      )}

      <SwitchNetworkContainer>
        {isWalletConnected ? (
          <>
            <List component="div">
              {networks.map((network) => (
                <>
                  <NetworkLabelItem key={network.id} role="button">
                    <label>
                      <Checkbox
                        key={network.id}
                        checked={localStorage.getItem(network.id)}
                        onChange={() => {
                          if (localStorage.getItem(network.id)) {
                            localStorage.removeItem(network.id)
                          } else {
                            localStorage.setItem(network.id, network.id)
                          }
                          setIsChecked(false)
                        }}
                      />
                      <span>{network.label}</span>
                    </label>
                  </NetworkLabelItem>
                </>
              ))}
            </List>
          </>
        ) : (
          <ConnectButton data-testid="heading-connect-btn" />
        )}
      </SwitchNetworkContainer>
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
