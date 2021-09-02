import React, { ReactElement, useRef, Fragment, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { makeStyles } from '@material-ui/core/styles'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Grow from '@material-ui/core/Grow'
import List from '@material-ui/core/List'
import Popper from '@material-ui/core/Popper'
import IconButton from '@material-ui/core/IconButton'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import { Divider, Icon } from '@gnosis.pm/safe-react-components'

import NetworkLabel from './NetworkLabel'
import Col from 'src/components/layout/Col'
import { screenSm, sm } from 'src/theme/variables'

import { sameString } from 'src/utils/strings'
import { getConfig, getNetworkName, setNetworkId } from 'src/config'
import { ReturnValue } from 'src/logic/hooks/useStateHandler'
import { ETHEREUM_NETWORK, NetworkInfo } from 'src/config/networks/network'
import { makeNetworkConfig } from 'src/logic/config/model/networkConfig'
import { configStore } from 'src/logic/config/store/actions'
import { APP_ENV } from 'src/utils/constants'
import { ROOT_ADDRESS } from 'src/routes/routes'

const styles = {
  root: {
    alignItems: 'center',
    display: 'flex',
    height: '100%',

    [`@media (min-width: ${screenSm}px)`]: {
      flexBasis: '180px',
      marginRight: '20px',
    },
  },
  networkList: {
    alignItems: 'center',
    cursor: 'pointer',
    display: 'flex',
    flex: '1 1 auto',
    justifyContent: 'space-between',
    [`@media (min-width: ${screenSm}px)`]: {
      paddingRight: sm,
    },
  },
  expand: {
    height: '30px',
    width: '30px',
  },
  popper: {
    zIndex: 1301,
  },
  network: {
    backgroundColor: 'white',
    borderRadius: sm,
    boxShadow: '0 0 10px 0 rgba(33, 48, 77, 0.1)',
    marginTop: '11px',
    minWidth: '180px',
    padding: '0',
  },
}

const useStyles = makeStyles(styles)

const StyledLink = styled.a`
  margin: 0;
  text-decoration: none;
  display: flex;
  justify-content: space-between;
  padding: 14px 16px 14px 0;

  :hover {
    background-color: ${({ theme }) => theme.colors.background};
  }
`
const StyledDivider = styled(Divider)`
  margin: 0;
`

type NetworkSelectorProps = ReturnValue & {
  networks: NetworkInfo[]
}

const NetworkSelector = ({ open, toggle, networks, clickAway }: NetworkSelectorProps): ReactElement => {
  const networkRef = useRef(null)
  const classes = useStyles()
  const dispatch = useDispatch()
  const history = useHistory()
  const networkName = getNetworkName().toLowerCase()

  const onNetworkSwitch = useCallback(
    (safeUrl: string, networkId: ETHEREUM_NETWORK) => {
      // FIXME remove navigation when L2-UX completes
      // This was added in order to switch network using navigation on prod
      // but be able to check chain swapping on dev environments and PRs
      if (APP_ENV === 'production') {
        window.location.href = safeUrl
      } else {
        setNetworkId(getNetworkName(networkId))
        const safeConfig = makeNetworkConfig(getConfig())
        dispatch(configStore(safeConfig))
        history.push(ROOT_ADDRESS)
      }
    },
    [dispatch, history],
  )

  return (
    <>
      <div className={classes.root} ref={networkRef}>
        <Col className={classes.networkList} end="sm" middle="xs" onClick={toggle}>
          <NetworkLabel />
          <IconButton className={classes.expand} disableRipple>
            {open ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Col>
        <Divider />
      </div>
      <Popper
        anchorEl={networkRef.current}
        className={classes.popper}
        open={open}
        placement="bottom"
        popperOptions={{ positionFixed: true }}
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps}>
            <>
              <ClickAwayListener mouseEvent="onClick" onClickAway={clickAway} touchEvent={false}>
                <List className={classes.network} component="div">
                  {networks.map((network) => (
                    <Fragment key={network.id}>
                      <StyledLink onClick={() => onNetworkSwitch(network.safeUrl, network.id)}>
                        <NetworkLabel networkInfo={network} />
                        {sameString(networkName, network.label?.toLowerCase()) && (
                          <Icon type="check" size="md" color="primary" />
                        )}
                      </StyledLink>
                      <StyledDivider />
                    </Fragment>
                  ))}
                </List>
              </ClickAwayListener>
            </>
          </Grow>
        )}
      </Popper>
    </>
  )
}

export default NetworkSelector
