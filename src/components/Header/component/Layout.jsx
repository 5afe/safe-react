// @flow
import * as React from 'react'
import { withStyles } from '@material-ui/core/styles'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import OpenInNew from '@material-ui/icons/OpenInNew'
import Grow from '@material-ui/core/Grow'
import Popper from '@material-ui/core/Popper'
import Divider from '~/components/layout/Divider'
import Paragraph from '~/components/layout/Paragraph'
import openHoc, { type Open } from '~/components/hoc/OpenHoc'
import Col from '~/components/layout/Col'
import Img from '~/components/layout/Img'
import Button from '~/components/layout/Button'
import Row from '~/components/layout/Row'
import Identicon from '~/components/Identicon'
import Spacer from '~/components/Spacer'
import { border, sm, md } from '~/theme/variables'
import Details from './Details'
import Provider from './Provider'

const logo = require('../assets/gnosis-safe-logo.svg')

type Props = Open & {
  provider: string,
  classes: Object,
  network: string,
  userAddress: string,
  connected: boolean,
}

const styles = theme => ({
  summary: {
    borderBottom: `solid 2px ${border}`,
    alignItems: 'center',
    height: '52px',
  },
  logo: {
    padding: `${sm} ${md}`,
    flexBasis: '95px',
  },
  user: {
    alignItems: 'center',
    border: '1px solid grey',
    padding: '10px',
    backgroundColor: '#f1f1f1',
  },
  address: {
    flexGrow: 1,
    textAlign: 'center',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  icon: {
    verticalAlign: 'bottom',
    height: 30,
    width: 30,
  },
  details: {
    alignItems: 'center',
    width: '375px',
    border: '1px solid grey',
    display: 'block',
    padding: '12px 8px 4px',
    margin: '0 0 0 auto',
  },
  column: {
    flexBasis: '33.33%',
  },
  helper: {
    borderLeft: `2px solid ${theme.palette.divider}`,
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
})

const openIconStyle = {
  height: '14px',
}

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
        {myRef => (
          <Popper open={open} anchorEl={myRef.current} placement="bottom-end">
            {({ TransitionProps }) => (
              <Grow
                {...TransitionProps}
              >
                <ClickAwayListener onClickAway={toggle} className={classes.details}>
                  <React.Fragment>
                    <Row grow margin="md">
                      <Details provider={provider} connected={connected} network={network} />
                      <Spacer />
                    </Row>
                    <Row className={classes.user} margin="md" grow >
                      <Identicon address={userAddress} diameter={25} />
                      <Paragraph className={classes.address} size="sm" noMargin>{userAddress}</Paragraph>
                      <OpenInNew style={openIconStyle} />
                    </Row>
                    <Col align="center" margin="md">
                      <Button size="small" variant="raised" color="secondary">DISCONNECT</Button>
                    </Col>
                  </React.Fragment>
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
