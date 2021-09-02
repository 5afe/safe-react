import { ButtonLink, GenericModal } from '@gnosis.pm/safe-react-components'
import { List, makeStyles } from '@material-ui/core'
import React, { Fragment, ReactElement, useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import NetworkLabel from 'src/components/AppLayout/Header/components/NetworkLabel'
import Block from 'src/components/layout/Block'
import { getConfig, getNetworkLabel, getNetworkName, getNetworks, setNetworkId } from 'src/config'
import { ETHEREUM_NETWORK } from 'src/config/networks/network'
import { makeNetworkConfig } from 'src/logic/config/model/networkConfig'
import { configStore } from 'src/logic/config/store/actions'
import { networkSelector } from 'src/logic/wallets/store/selectors'
import { lg } from 'src/theme/variables'
import { APP_ENV } from 'src/utils/constants'

export const selectNetworkStepLabel = 'Connect wallet & select network'

function SelectNetworkStep(): ReactElement {
  const classes = useStyles()
  const dispatch = useDispatch()

  const [isNetworkSelectorPopupOpen, setIsNetworkSelectorPopupOpen] = useState(false)

  const currentNetworkId = useSelector(networkSelector)

  const currentNetworkName = getNetworkLabel(currentNetworkId)

  function openNetworkSelectorPopup() {
    setIsNetworkSelectorPopupOpen(true)
  }

  const networks = getNetworks()

  const onNetworkSwitch = useCallback(
    (safeUrl: string, networkId: ETHEREUM_NETWORK) => {
      const isProduction = APP_ENV === 'production'
      if (isProduction) {
        window.location.href = safeUrl
      } else {
        setNetworkId(getNetworkName(networkId))
        const safeConfig = makeNetworkConfig(getConfig())
        dispatch(configStore(safeConfig))
        setIsNetworkSelectorPopupOpen(false)
      }
    },
    [dispatch],
  )

  return (
    <Block className={classes.padding}>
      <div className={classes.labelContainer}>
        Select network on which the Safe was created:
        {currentNetworkName ? (
          <NetworkLabel />
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
      {isNetworkSelectorPopupOpen && (
        <GenericModal
          onClose={() => setIsNetworkSelectorPopupOpen(false)}
          title="Select Network"
          body={
            <List component="div">
              {networks.map((network) => (
                <Fragment key={network.id}>
                  <div
                    role={'button'}
                    className={classes.networkLabel}
                    onClick={() => onNetworkSwitch(network.safeUrl, network.id)}
                  >
                    <NetworkLabel networkInfo={network} />
                  </div>
                </Fragment>
              ))}
            </List>
          }
        />
      )}
    </Block>
  )
}

export default SelectNetworkStep

const useStyles = makeStyles({
  padding: {
    padding: lg,
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
    margin: lg,
    cursor: 'pointer',
  },
})
