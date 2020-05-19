//
import { withStyles } from '@material-ui/core/styles'
import * as React from 'react'

import CircleDot from 'src/components/Header/components/CircleDot'
import {} from 'src/components/hoc/OpenHoc'
import Col from 'src/components/layout/Col'
import Paragraph from 'src/components/layout/Paragraph'
import { sm } from 'src/theme/variables'

const styles = () => ({
  network: {
    fontFamily: 'Averta, sans-serif',
  },
  account: {
    alignItems: 'start',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    justifyContent: 'center',
    paddingRight: sm,
  },
  connect: {
    letterSpacing: '-0.5px',
    whiteSpace: 'nowrap',
  },
})

const ProviderDisconnected = ({ classes }) => (
  <>
    <CircleDot circleSize={35} dotRight={11} dotSize={16} dotTop={24} keySize={17} mode="error" />
    <Col className={classes.account} end="sm" layout="column" middle="xs">
      <Paragraph className={classes.network} noMargin size="sm" transform="capitalize" weight="bold">
        Not Connected
      </Paragraph>
      <Paragraph className={classes.connect} color="fancy" noMargin size="sm">
        Connect Wallet
      </Paragraph>
    </Col>
  </>
)

export default withStyles(styles)(ProviderDisconnected)
