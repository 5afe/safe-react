// @flow
import * as React from 'react'
import { Link } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import Grow from '@material-ui/core/Grow'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Popper from '@material-ui/core/Popper'
import List from '@material-ui/core/List'
import Divider from '~/components/layout/Divider'
import openHoc, { type Open } from '~/components/hoc/OpenHoc'
import Col from '~/components/layout/Col'
import Img from '~/components/layout/Img'
import Row from '~/components/layout/Row'
import Spacer from '~/components/Spacer'
import {
  border, sm, md, headerHeight, screenSm,
} from '~/theme/variables'
import Provider from './Provider'
import NetworkLabel from './NetworkLabel'
import SafeListHeader from './SafeListHeader'

const logo = require('../assets/gnosis-safe-multisig-logo.svg')

type Props = Open & {
  classes: Object,
  providerDetails: React.Node,
  providerInfo: React.Node
}

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

const Layout = openHoc(
  ({
    open,
    toggle,
    clickAway,
    classes,
    providerInfo,
    providerDetails,
  }: Props) => (
    <Row className={classes.summary}>
      <Col start="xs" middle="xs" className={classes.logo}>
        <Link to="/">
          <Img src={logo} height={32} alt="Gnosis Team Safe" />
        </Link>
      </Col>
      <Divider />
      <SafeListHeader />
      <Divider />
      <NetworkLabel />
      <Spacer />
      <Provider open={open} toggle={toggle} info={providerInfo}>
        {(providerRef) => (
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
                  <ClickAwayListener
                    onClickAway={clickAway}
                    mouseEvent="onClick"
                    touchEvent={false}
                  >
                    <List className={classes.root} component="div">
                      {providerDetails}
                    </List>
                  </ClickAwayListener>
                </>
              </Grow>
            )}
          </Popper>
        )}
      </Provider>
    </Row>
  ),
)

export default withStyles(styles)(Layout)
