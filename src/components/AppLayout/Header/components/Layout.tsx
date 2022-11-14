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
import { shouldSwitchWalletChain } from 'src/logic/wallets/store/selectors'
import { useSelector } from 'react-redux'
import { OVERVIEW_EVENTS } from 'src/utils/events/overview'
import Track from 'src/components/Track'
import Notifications from 'src/components/AppLayout/Header/components/Notifications'
import SafeTokenWidget, { getSafeTokenAddress } from './SafeTokenWidget'
import { _getChainId } from 'src/config'
import GnosisLogo from '../assets/safe-logo.svg'

const styles = () => ({
  root: {
    backgroundColor: 'black',
    borderRadius: sm,
    border: '2px solid #06fc99',
    marginTop: '11px',
    minWidth: '280px',
    padding: 0,
  },
  summary: {
    alignItems: 'center',
    backgroundColor: 'black',
    flexWrap: 'nowrap',
    height: headerHeight,
    position: 'fixed',
    width: '100%',
    zIndex: 99999,
  },
  logo: {
    [`@media (min-width: ${screenSm}px)`]: {
      maxWidth: 'none',
      paddingLeft: md,
      paddingRight: md,
    },
    [`@media (max-width: ${screenSm}px)`]: {
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
      textDecoration: 'none',
    },
  },
  wallet: {
    paddingRight: md,
  },
  popper: {
    zIndex: 1301,
    color: '#06fc99',
  },
  network: {
    borderRadius: sm,
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
  const { clickAway: clickAwayNetworks, open: openNetworks } = useStateHandler()
  const isWrongChain = useSelector(shouldSwitchWalletChain)
  const chainId = _getChainId()
  const chainHasSafeToken = Boolean(getSafeTokenAddress(chainId))

  return (
    <Row className={classes.summary}>
      <Col className={classes.logo} middle="xs" start="xs">
        <Track {...OVERVIEW_EVENTS.HOME}>
          <Link to={ROOT_ROUTE}>
            <span style={{ paddingLeft: '35%' }}>
              <img alt="Safe" src={`${GnosisLogo}`} id="safe-logo" height={36} />
            </span>
          </Link>
        </Track>
      </Col>

      <Spacer />

      {isWrongChain && (
        <div className={classes.wallet}>
          <WalletSwitch />
        </div>
      )}

      {chainHasSafeToken && <SafeTokenWidget />}
      <Notifications open={openNotifications} toggle={toggleNotifications} clickAway={clickAwayNotifications} />

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

      {/* network selector in navbar */}
      <NetworkSelector open={openNetworks} toggle={() => {}} clickAway={clickAwayNetworks} />
    </Row>
  )
}

export default withStyles(styles as any)(Layout)
