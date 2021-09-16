import React, { ReactElement, useState } from 'react'
import { useSelector } from 'react-redux'
import { ButtonLink } from '@gnosis.pm/safe-react-components'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import DialogContent from '@material-ui/core/DialogContent'
import List from '@material-ui/core/List'
import { makeStyles, Typography } from '@material-ui/core'
import NetworkLabel from 'src/components/AppLayout/Header/components/NetworkLabel'
import Block from 'src/components/layout/Block'
import { getNetworkLabel, getNetworks } from 'src/config'
import { lg } from 'src/theme/variables'
import { currentChainId } from 'src/logic/config/store/selectors'
import { ETHEREUM_NETWORK } from 'src/config/networks/network'
import { setNetwork } from 'src/logic/config/utils'

export const selectNetworkStepLabel = 'Connect wallet & select network'

function SelectNetworkStep(): ReactElement {
  const classes = useStyles()

  const [isNetworkSelectorPopupOpen, setIsNetworkSelectorPopupOpen] = useState(false)

  const currentNetworkId = useSelector(currentChainId)

  const currentNetworkName = getNetworkLabel(currentNetworkId)

  function openNetworkSelectorPopup() {
    setIsNetworkSelectorPopupOpen(true)
  }

  const networks = getNetworks()

  const onNetworkSwitch = (networkId: ETHEREUM_NETWORK) => {
    setNetwork(networkId)
    setIsNetworkSelectorPopupOpen(false)
  }

  return (
    <Block className={classes.padding} data-testid={'select-network-step'}>
      <div className={classes.labelContainer}>
        Select network on which the Safe was created:
        {currentNetworkName ? (
          <NetworkLabel onClick={openNetworkSelectorPopup} />
        ) : (
          <ButtonLink type="button" onClick={openNetworkSelectorPopup} color="primary">
            Select Network
          </ButtonLink>
        )}
      </div>
      {currentNetworkName && (
        <div className={classes.switchButtonContainer}>
          <ButtonLink type="button" onClick={openNetworkSelectorPopup} color="primary">
            Switch Network
          </ButtonLink>
        </div>
      )}
      <Dialog
        onClose={() => setIsNetworkSelectorPopupOpen(false)}
        aria-labelledby="select-network"
        data-testid={'select-network-popup'}
        open={isNetworkSelectorPopupOpen}
      >
        <DialogTitle disableTypography className={classes.dialogTitle}>
          <Typography variant={'h5'}>Select Network</Typography>
          <IconButton aria-label="close" onClick={() => setIsNetworkSelectorPopupOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers className={classes.dialogContent}>
          <List component="div">
            {networks.map((network) => (
              <div
                key={network.id}
                role={'button'}
                className={classes.networkLabel}
                onClick={() => onNetworkSwitch(network.id)}
              >
                <NetworkLabel networkInfo={network} />
              </div>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </Block>
  )
}

export default SelectNetworkStep

const useStyles = makeStyles({
  padding: {
    padding: lg,
  },
  dialogContent: {
    minWidth: '500px',
  },
  dialogTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '16px 24px',
  },
  labelContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  switchButtonContainer: {
    margin: lg,
    display: 'flex',
    justifyContent: 'center',
  },
  networkLabel: {
    margin: `${lg} auto`,
    cursor: 'pointer',
    maxWidth: '50%',
  },
})
