import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import List from '@material-ui/core/List'
import Popper from '@material-ui/core/Popper'
import { withStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'

import Provider from './Provider'
import NetworkSelector from './NetworkSelector'
import Spacer from 'src/components/Spacer'
import Col from 'src/components/layout/Col'
import Img from 'src/components/layout/Img'
import Row from 'src/components/layout/Row'
import { headerHeight, md, screenSm, sm } from 'src/theme/variables'
import { useStateHandler } from 'src/logic/hooks/useStateHandler'
import SafeLogo from '../assets/boba_logo_black_final.svg'
import { WELCOME_ROUTE } from 'src/routes/routes'
import WalletSwitch from 'src/components/WalletSwitch'
import Divider from 'src/components/layout/Divider'
import { shouldSwitchWalletChain } from 'src/logic/wallets/store/selectors'
import { useSelector } from 'react-redux'

const styles = () => ({
  root: {
    backgroundColor: 'white',
    borderRadius: sm,
    boxShadow: '0 0 10px 0 rgba(33, 48, 77, 0.1)',
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
    flexBasis: '140px',
    flexShrink: '0',
    flexGrow: '0',
    maxWidth: '55px',
    padding: sm,
    marginTop: '4px',
    [`@media (min-width: ${screenSm}px)`]: {
      maxWidth: 'none',
      paddingLeft: md,
      paddingRight: md,
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
  const { clickAway, open, toggle } = useStateHandler()
  const { clickAway: clickAwayNetworks, open: openNetworks, toggle: toggleNetworks } = useStateHandler()
  const isWrongChain = useSelector(shouldSwitchWalletChain)

  return (
    <Row className={classes.summary}>
      <Col className={classes.logo} middle="xs" start="xs">
        <Link to={WELCOME_ROUTE}>
          <Img alt="Boba Multisig" height={36} src={SafeLogo} testId="heading-gnosis-logo" id="safe-logo" />
        </Link>
      </Col>

      <Spacer />

      {isWrongChain && (
        <div className={classes.wallet}>
          <WalletSwitch />
          <Divider />
        </div>
      )}

      <Provider
        info={providerInfo}
        open={open}
        toggle={toggle}
        render={(providerRef) =>
          providerRef.current && (
            <WalletPopup
              anchorEl={providerRef.current}
              providerDetails={providerDetails}
              open={open}
              classes={classes}
              onClose={clickAway}
            />
          )
        }
      />

      <NetworkSelector open={openNetworks} toggle={toggleNetworks} clickAway={clickAwayNetworks} />
    </Row>
  )
}

export default withStyles(styles as any)(Layout)
