import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Grow from '@material-ui/core/Grow'
import List from '@material-ui/core/List'
import Popper, { PopperProps } from '@material-ui/core/Popper'
import { Link } from 'react-router-dom'
import { makeStyles, createStyles } from '@material-ui/core'
import { ReactElement } from 'react'

import Provider from './Provider'
import NetworkSelector from './NetworkSelector'
import Spacer from 'src/components/Spacer'
import Col from 'src/components/layout/Col'
import Img from 'src/components/layout/Img'
import Row from 'src/components/layout/Row'
import { headerHeight, md, screenSm, sm } from 'src/theme/variables'
import { useStateHandler } from 'src/logic/hooks/useStateHandler'
import SafeLogo from '../assets/gnosis-safe-multisig-logo.svg'
import { getNetworks } from 'src/config'
import { WELCOME_ROUTE } from 'src/routes/routes'

const useStyles = makeStyles(
  createStyles({
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
      flexShrink: 0,
      flexGrow: 0,
      maxWidth: '55px',
      padding: sm,
      marginTop: '4px',
      [`@media (min-width: ${screenSm}px)`]: {
        maxWidth: 'none',
        paddingLeft: md,
        paddingRight: md,
      },
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
  }),
)

type WalletPopupProps = {
  anchorEl: PopperProps['anchorEl']
  providerDetails: ReactElement
  open: boolean
  onClose: () => unknown
}
const WalletPopup = ({ anchorEl, providerDetails, open, onClose }: WalletPopupProps): ReactElement => {
  const classes = useStyles()
  return (
    <Popper
      anchorEl={anchorEl}
      className={classes.popper}
      open={open}
      placement="bottom"
      popperOptions={{ positionFixed: true }}
    >
      {({ TransitionProps }) => (
        <Grow {...TransitionProps}>
          <>
            <ClickAwayListener mouseEvent="onClick" onClickAway={onClose} touchEvent={false}>
              <List className={classes.root} component="div">
                {providerDetails}
              </List>
            </ClickAwayListener>
          </>
        </Grow>
      )}
    </Popper>
  )
}

type LayoutProps = {
  providerDetails: ReactElement
  providerInfo: ReactElement
  shouldSwitchChain: boolean
}

const Layout = ({ providerDetails, providerInfo, shouldSwitchChain }: LayoutProps): ReactElement => {
  const classes = useStyles()
  const { clickAway, open, toggle } = useStateHandler()
  const { clickAway: clickAwayNetworks, open: openNetworks, toggle: toggleNetworks } = useStateHandler()
  const networks = getNetworks()
  const { isDesktop } = window
  const isOpen = open || shouldSwitchChain

  return (
    <Row className={classes.summary}>
      <Col className={classes.logo} middle="xs" start="xs">
        <Link to={WELCOME_ROUTE}>
          <Img alt="Gnosis Team Safe" height={36} src={SafeLogo} testId="heading-gnosis-logo" />
        </Link>
      </Col>
      <Spacer />
      <Provider
        info={providerInfo}
        open={isOpen}
        toggle={toggle}
        render={(providerRef) =>
          providerRef.current && (
            <WalletPopup
              anchorEl={providerRef.current}
              providerDetails={providerDetails}
              open={isOpen}
              onClose={clickAway}
            />
          )
        }
      />
      {!isDesktop && (
        <NetworkSelector
          open={openNetworks}
          networks={networks}
          toggle={toggleNetworks}
          clickAway={clickAwayNetworks}
        />
      )}
    </Row>
  )
}

export default Layout
