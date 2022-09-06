import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import List from '@material-ui/core/List'
import Popper from '@material-ui/core/Popper'
import { withStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'

import Provider from './Provider'
import NetworkSelector from './NetworkSelector'
import Spacer from 'src/components/Spacer'
import Col from 'src/components/layout/Col'
import Row from 'src/components/layout/Row'
import { headerHeight, md, screenSm, sm } from 'src/theme/variables'
import { useStateHandler } from 'src/logic/hooks/useStateHandler'
import { ROOT_ROUTE } from 'src/routes/routes'
import WalletSwitch from 'src/components/WalletSwitch'
import Divider from 'src/components/layout/Divider'
import { shouldSwitchWalletChain } from 'src/logic/wallets/store/selectors'
import { useSelector } from 'react-redux'
import { OVERVIEW_EVENTS } from 'src/utils/events/overview'
import Track from 'src/components/Track'
import Notifications from 'src/components/AppLayout/Header/components/Notifications'
import AnimatedLogo from 'src/components/AppLayout/Header/components/AnimatedLogo'
import SafeTokenWidget, { getSafeTokenAddress } from './SafeTokenWidget'
import { _getChainId } from 'src/config'

const styles = () => ({
  root: {
    backgroundColor: 'white',
    borderRadius: sm,
    boxShadow: 'rgb(40 54 61 / 18%) 1px 2px 10px 0px',
    marginTop: '11px',
    minWidth: '280px',
    padding: 0,
  },
  summary: {
    alignItems: 'center',
    backgroundColor: 'white',
    flexWrap: 'nowrap',
    height: headerHeight,
    position: 'fixed',
    width: '100%',
    zIndex: 1301,
  },
  logo: {
    [`@media (min-width: ${screenSm}px)`]: {
      maxWidth: 'none',
      paddingLeft: md,
      paddingRight: md,
    },
    [`@media (max-width: ${screenSm}px)`]: {
      maxWidth: '95px',
      overflow: 'hidden',
      '& img': {
        width: '72px',
        height: 'auto',
      },
    },
    '& a': {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
  },
  wallet: {
    paddingRight: md,
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
})

const WalletPopup = ({ anchorEl, providerDetails, classes, open, onClose }) => {
  if (!open) {
    return null
  }
  return (
    <Popper
      anchorEl={anchorEl}
      className={classes.popper}
      open
      placement="bottom"
      popperOptions={{ positionFixed: true }}
    >
      <ClickAwayListener mouseEvent="onClick" onClickAway={onClose} touchEvent={false}>
        <List className={classes.root} component="div">
          {providerDetails}
        </List>
      </ClickAwayListener>
    </Popper>
  )
}

const Layout = ({ classes, providerDetails, providerInfo }) => {
  const { clickAway: clickAwayNotifications, open: openNotifications, toggle: toggleNotifications } = useStateHandler()
  const { clickAway: clickAwayWallet, open: openWallet, toggle: toggleWallet } = useStateHandler()
  const { clickAway: clickAwayNetworks, open: openNetworks, toggle: toggleNetworks } = useStateHandler()
  const isWrongChain = useSelector(shouldSwitchWalletChain)
  const chainId = _getChainId()
  const chainHasSafeToken = Boolean(getSafeTokenAddress(chainId))

  return (
    <Row className={classes.summary}>
      <Col className={classes.logo} middle="xs" start="xs">
        <Track {...OVERVIEW_EVENTS.HOME}>
          <Link to={ROOT_ROUTE}>
            <AnimatedLogo />
          </Link>
        </Track>
      </Col>

      <Spacer />

      {isWrongChain && (
        <div className={classes.wallet}>
          <WalletSwitch />
          <Divider />
        </div>
      )}

      {chainHasSafeToken && (
        <>
          <Divider />
          <SafeTokenWidget />
        </>
      )}

      <Divider />
      <Notifications open={openNotifications} toggle={toggleNotifications} clickAway={clickAwayNotifications} />

      <Divider />
      <Provider
        info={providerInfo}
        open={openWallet}
        toggle={toggleWallet}
        render={(providerRef) =>
          providerRef.current && (
            <WalletPopup
              anchorEl={providerRef.current}
              providerDetails={providerDetails}
              open={openWallet}
              classes={classes}
              onClose={clickAwayWallet}
            />
          )
        }
      />

      <Divider />
      <NetworkSelector open={openNetworks} toggle={toggleNetworks} clickAway={clickAwayNetworks} />
    </Row>
  )
}

export default withStyles(styles as any)(Layout)
