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
import { border, sm, md } from '~/theme/variables'
import Provider from './Provider'

const logo = require('../assets/gnosis-safe-logo.svg')

type Props = Open & {
  classes: Object,
  providerDetails: React.Node,
  providerInfo: React.Node,
}

const styles = () => ({
  root: {
    backgroundColor: 'white',
    padding: 0,
    boxShadow: '0 0 10px 0 rgba(33, 48, 77, 0.1)',
    minWidth: '280px',
    left: '4px',
  },
  summary: {
    borderBottom: `solid 1px ${border}`,
    alignItems: 'center',
    height: '53px',
    backgroundColor: 'white',
  },
  logo: {
    padding: `${sm} ${md}`,
    flexBasis: '95px',
    flexGrow: 0,
  },
})

const Layout = openHoc(({
  open, toggle, clickAway, classes, providerInfo, providerDetails,
}: Props) => (
  <React.Fragment>
    <Row className={classes.summary}>
      <Col start="xs" middle="xs" className={classes.logo}>
        <Link to="/">
          <Img src={logo} height={32} alt="Gnosis Team Safe" />
        </Link>
      </Col>
      <Divider />
      <Spacer />
      <Divider />
      <Provider open={open} toggle={toggle} info={providerInfo}>
        {providerRef => (
          <Popper open={open} anchorEl={providerRef.current} placement="bottom-end">
            {({ TransitionProps }) => (
              <Grow {...TransitionProps}>
                <ClickAwayListener onClickAway={clickAway} mouseEvent="onClick" touchEvent={false}>
                  <List className={classes.root} component="div">
                    {React.cloneElement(providerDetails, { toggle })}
                  </List>
                </ClickAwayListener>
              </Grow>
            )}
          </Popper>
        )}
      </Provider>
    </Row>
  </React.Fragment>
))

export default withStyles(styles)(Layout)
