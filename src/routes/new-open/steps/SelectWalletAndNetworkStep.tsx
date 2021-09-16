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
import Block from 'src/components/layout/Block'
import { getNetworks } from 'src/config'
import { lg } from 'src/theme/variables'
import NetworkLabel from 'src/components/NetworkLabel/NetworkLabel'
import Paragraph from 'src/components/layout/Paragraph'
import { providerNameSelector } from 'src/logic/wallets/store/selectors'
import ConnectButton from 'src/components/ConnectButton'

export const selectWalletAndNetworkStepLabel = 'Connect wallet & select network'

function SelectWalletAndNetworkStep(): ReactElement {
  const classes = useStyles()
  // const dispatch = useDispatch()

  const [isNetworkSelectorPopupOpen, setIsNetworkSelectorPopupOpen] = useState(false)
  const isWalletConnected = !!useSelector(providerNameSelector)

  // const currentNetworkId = useSelector(currentChainId)

  // const currentNetworkName = getNetworkLabel(currentNetworkId)

  function openNetworkSelectorPopup() {
    setIsNetworkSelectorPopupOpen(true)
  }

  const networks = getNetworks()

  // const onNetworkSwitch = useCallback(
  //   (safeUrl: string, networkId: ETHEREUM_NETWORK) => {
  //     setNetworkId(getNetworkName(networkId))
  //     const safeConfig = makeNetworkConfig(getConfig())
  //     dispatch(configStore(safeConfig))
  //     setIsNetworkSelectorPopupOpen(false)
  //   },
  //   [dispatch],
  // )

  return (
    <Block className={classes.padding} data-testid={'select-network-step'}>
      {isWalletConnected ? (
        <Paragraph color="primary" noMargin size="lg">
          Select network on which to create your Safe. You are currently connected to{' '}
          <NetworkLabel onClick={openNetworkSelectorPopup} />
        </Paragraph>
      ) : (
        <Paragraph color="primary" noMargin size="lg">
          In order to select the network to create your Safe, you need to connect a wallet
        </Paragraph>
      )}

      <div className={classes.switchButtonContainer}>
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
      </div>
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
                // onClick={() => onNetworkSwitch(network.safeUrl, network.id)}
              >
                <NetworkLabel networkInfo={network} flexGrow />
              </div>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </Block>
  )
}

export default SelectWalletAndNetworkStep

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
  switchButtonContainer: {
    margin: lg,
    display: 'flex',
    justifyContent: 'center',
  },
  networkLabel: {
    display: 'flex',
    margin: `${lg} auto`,
    cursor: 'pointer',
    maxWidth: '50%',
  },
})
