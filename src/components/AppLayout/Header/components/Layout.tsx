import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Grow from '@material-ui/core/Grow'
import List from '@material-ui/core/List'
import Popper from '@material-ui/core/Popper'
import { withStyles } from '@material-ui/core/styles'
import * as React from 'react'
import { Link } from 'react-router-dom'

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
  popper: {
    zIndex: 2000,
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

const Layout = ({ classes, providerDetails, providerInfo }) => {
  const { clickAway, open, toggle } = useStateHandler()
  const { clickAway: clickAwayNetworks, open: openNetworks, toggle: toggleNetworks } = useStateHandler()
  const networks = getNetworks()
  const { isDesktop } = window
  return (
    <Row className={classes.summary}>
      <Col className={classes.logo} middle="xs" start="xs">
        <Link to="/">
          <Img alt="Gnosis Team Safe" height={36} src={SafeLogo} testId="heading-gnosis-logo" />
        </Link>
      </Col>
      <Spacer />
      <Provider
        info={providerInfo}
        open={open}
        toggle={toggle}
        render={(providerRef) => (
          <Popper
            anchorEl={providerRef.current}
            className={classes.popper}
            open={open}
            placement="bottom"
            popperOptions={{ positionFixed: true }}
          >
            {({ TransitionProps }) => (
              <Grow {...TransitionProps}>
                <>
                  <ClickAwayListener mouseEvent="onClick" onClickAway={clickAway} touchEvent={false}>
                    <List className={classes.root} component="div">
                      {providerDetails}
                    </List>
                  </ClickAwayListener>
                </>
              </Grow>
            )}
          </Popper>
        )}
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

export default withStyles(styles as any)(Layout)
