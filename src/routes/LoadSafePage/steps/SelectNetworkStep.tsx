import { ReactElement, useState } from 'react'
import { ButtonLink } from '@gnosis.pm/safe-react-components'
import styled from 'styled-components'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import DialogContent from '@material-ui/core/DialogContent'
import List from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'

import Block from 'src/components/layout/Block'
import { ChainId } from 'src/config/chain.d'
import { setChainId } from 'src/logic/config/utils'

import { lg } from 'src/theme/variables'
import Paragraph from 'src/components/layout/Paragraph'
import NetworkLabel from 'src/components/NetworkLabel/NetworkLabel'
import { getChains } from 'src/config/cache/chains'

export const selectNetworkStepLabel = 'Select network'

function SelectNetworkStep(): ReactElement {
  const [isNetworkSelectorPopupOpen, setIsNetworkSelectorPopupOpen] = useState(false)

  function openNetworkSelectorPopup() {
    setIsNetworkSelectorPopupOpen(true)
  }

  const onNetworkSwitch = (chainId: ChainId) => {
    setChainId(chainId)
    setIsNetworkSelectorPopupOpen(false)
  }

  return (
    <Container data-testid={'select-network-step'}>
      <Paragraph color="#06fc99" noMargin size="lg">
        Select network on which the Safe was created: <NetworkLabel onClick={openNetworkSelectorPopup} />
      </Paragraph>
      <SwitchNetworkContainer>
        <ButtonLink type="button" onClick={openNetworkSelectorPopup} color="primary">
          Switch Network
        </ButtonLink>
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

export default SelectNetworkStep

const Container = styled(Block)`
  padding: ${lg};
`

const StyledDialogContent = styled(DialogContent)`
  min-width: 500px;
`

const StyledDialogTitle = styled(DialogTitle)`
  display: flex;
  justify-content: space-between;
  padding: 16px 24px;
`
const SwitchNetworkContainer = styled.div`
  margin: ${lg};
  display: flex;
  justify-content: center;
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
