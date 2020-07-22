import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Grow from '@material-ui/core/Grow'
import List from '@material-ui/core/List'
import Popper from '@material-ui/core/Popper'
import { withStyles } from '@material-ui/core/styles'
import * as React from 'react'
import { Link } from 'react-router-dom'

import NetworkLabel from './NetworkLabel'
import Provider from './Provider'
import SafeListHeader from './SafeListHeader'

import Spacer from 'src/components/Spacer'
import openHoc from 'src/components/hoc/OpenHoc'
import Col from 'src/components/layout/Col'
import Divider from 'src/components/layout/Divider'
import Img from 'src/components/layout/Img'
import Row from 'src/components/layout/Row'
import { border, headerHeight, md, screenSm, sm } from 'src/theme/variables'

const logo = require('../assets/gnosis-safe-multisig-logo.svg')

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
    borderBottom: `solid 2px ${border}`,
    boxShadow: '0 2px 4px 0 rgba(212, 212, 211, 0.59)',
    flexWrap: 'nowrap',
    height: headerHeight,
    position: 'fixed',
    width: '100%',
    zIndex: 1301,
  },
  logo: {
    flexBasis: '95px',
    flexShrink: '0',
    flexGrow: '0',
    maxWidth: '55px',
    padding: sm,
    [`@media (min-width: ${screenSm}px)`]: {
      maxWidth: 'none',
      paddingLeft: md,
      paddingRight: md,
    },
  },
  popper: {
    zIndex: 2000,
  },
})

const Layout = openHoc(({ classes, clickAway, open, providerDetails, providerInfo, toggle }) => (
  <Row className={classes.summary}>
    <Col className={classes.logo} middle="xs" start="xs">
      <Link to="/">
        <Img alt="Gnosis Team Safe" height={32} src={logo} testId="heading-gnosis-logo" />
      </Link>
    </Col>
    <Divider />
    <SafeListHeader />
    <Divider />
    <NetworkLabel />
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
  </Row>
))

export default withStyles(styles as any)(Layout)
