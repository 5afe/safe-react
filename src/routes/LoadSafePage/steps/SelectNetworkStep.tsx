import { ReactElement, useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import { ButtonLink } from '@gnosis.pm/safe-react-components'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import DialogContent from '@material-ui/core/DialogContent'
import List from '@material-ui/core/List'
import { makeStyles, Typography } from '@material-ui/core'
import Block from 'src/components/layout/Block'
import { getConfig, getNetworkName, getNetworks, setNetworkId } from 'src/config'
import { ETHEREUM_NETWORK } from 'src/config/networks/network'
import { makeNetworkConfig } from 'src/logic/config/model/networkConfig'
import { configStore } from 'src/logic/config/store/actions'
import { lg } from 'src/theme/variables'
import Paragraph from 'src/components/layout/Paragraph'
import NetworkLabel from 'src/components/NetworkLabel/NetworkLabel'

export const selectNetworkStepLabel = 'Select network'

function SelectNetworkStep(): ReactElement {
  const classes = useStyles()
  const dispatch = useDispatch()

  const [isNetworkSelectorPopupOpen, setIsNetworkSelectorPopupOpen] = useState(false)

  function openNetworkSelectorPopup() {
    setIsNetworkSelectorPopupOpen(true)
  }

  const networks = getNetworks()

  const onNetworkSwitch = useCallback(
    (safeUrl: string, networkId: ETHEREUM_NETWORK) => {
      setNetworkId(getNetworkName(networkId))
      const safeConfig = makeNetworkConfig(getConfig())
      dispatch(configStore(safeConfig))
      setIsNetworkSelectorPopupOpen(false)
    },
    [dispatch],
  )

  return (
    <Block className={classes.padding} data-testid={'select-network-step'}>
      <Paragraph color="primary" noMargin size="lg">
        Select network on which the Safe was created: <NetworkLabel onClick={openNetworkSelectorPopup} />
      </Paragraph>
      <div className={classes.switchButtonContainer}>
        <ButtonLink type="button" onClick={openNetworkSelectorPopup} color="primary">
          Switch Network
        </ButtonLink>
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
                onClick={() => onNetworkSwitch(network.safeUrl, network.id)}
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
    display: 'flex',
    margin: `${lg} auto`,
    cursor: 'pointer',
    maxWidth: '50%',
  },
})
