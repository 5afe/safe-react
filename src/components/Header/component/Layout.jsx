// @flow
import * as React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Divider from '~/components/layout/Divider'
import openHoc, { type Open } from '~/components/hoc/OpenHoc'
import Col from '~/components/layout/Col'
import Img from '~/components/layout/Img'
import Row from '~/components/layout/Row'
import Spacer from '~/components/Spacer'
import { border, sm, md } from '~/theme/variables'

const logo = require('../assets/gnosis-safe-logo.svg')

type Props = Open & {
  classes: Object,
  children: React$Node,
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

const Header = openHoc(({ classes, children }: Props) => (
  <React.Fragment>
    <Row className={classes.summary}>
      <Col start="xs" middle="xs" className={classes.logo}>
        <Img src={logo} height={32} alt="Gnosis Team Safe" />
      </Col>
      <Divider />
      <Spacer />
      <Divider />
      { children }
    </Row>
  </React.Fragment>
))

export default withStyles(styles)(Header)
