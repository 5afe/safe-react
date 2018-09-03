// @flow
import * as React from 'react'
import { withStyles } from '@material-ui/core/styles'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Grow from '@material-ui/core/Grow'
import Popper from '@material-ui/core/Popper'
import Divider from '~/components/layout/Divider'
import openHoc, { type Open } from '~/components/hoc/OpenHoc'
import Col from '~/components/layout/Col'
import Img from '~/components/layout/Img'
import Row from '~/components/layout/Row'
import Spacer from '~/components/Spacer'
import { border, sm, md } from '~/theme/variables'
import Provider from './Provider'
import UserDetails from './UserDetails'

const logo = require('../assets/gnosis-safe-logo.svg')

type Props = Open & {
  provider: string,
  classes: Object,
  network: string,
  userAddress: string,
  connected: boolean,
}

const styles = () => ({
  summary: {
    borderBottom: `solid 2px ${border}`,
    alignItems: 'center',
    height: '52px',
    backgroundColor: 'white',
  },
  logo: {
    padding: `${sm} ${md}`,
    flexBasis: '95px',
  },
})

const Header = openHoc(({
  open, toggle, provider, network, connected, classes, userAddress,
}: Props) => (
  <React.Fragment>
    <Row className={classes.summary}>
      <Col start="xs" middle="xs" className={classes.logo}>
        <Img src={logo} height={32} alt="Gnosis Team Safe" />
      </Col>
      <Divider />
      <Spacer />
      <Divider />
      <Provider
        provider={provider}
        network={network}
        userAddress={userAddress}
        connected={connected}
        open={open}
        toggle={toggle}
      >
        {providerRef => (
          <Popper open={open} anchorEl={providerRef.current} placement="bottom-end">
            {({ TransitionProps }) => (
              <Grow
                {...TransitionProps}
              >
                <ClickAwayListener onClickAway={toggle}>
                  <UserDetails
                    provider={provider}
                    network={network}
                    userAddress={userAddress}
                    connected={connected}
                  />
                </ClickAwayListener>
              </Grow>
            )}
          </Popper>
        )}
      </Provider>
    </Row>
  </React.Fragment>
))

export default withStyles(styles)(openHoc(Header))
