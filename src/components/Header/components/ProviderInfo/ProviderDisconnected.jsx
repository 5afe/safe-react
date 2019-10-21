// @flow
import * as React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Paragraph from '~/components/layout/Paragraph'
import Col from '~/components/layout/Col'
import { type Open } from '~/components/hoc/OpenHoc'
import { sm } from '~/theme/variables'
import CircleDot from '~/components/Header/components/CircleDot'

type Props = Open & {
  classes: Object,
  children: Function,
}

const styles = () => ({
  network: {
    fontFamily: 'Averta, sans-serif',
  },
  account: {
    paddingRight: sm,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'start',
    flexGrow: 1,
  },
  connect: {
    letterSpacing: '-0.5px',
  },
})

const ProviderDisconnected = ({ classes }: Props) => (
  <>
    <CircleDot keySize={17} circleSize={35} dotSize={16} dotTop={24} dotRight={11} mode="error" />
    <Col end="sm" middle="xs" layout="column" className={classes.account}>
      <Paragraph size="sm" transform="capitalize" className={classes.network} noMargin weight="bold">
        Not Connected
      </Paragraph>
      <Paragraph size="sm" color="fancy" className={classes.connect} noMargin>
        Connect Wallet
      </Paragraph>
    </Col>
  </>
)

export default withStyles(styles)(ProviderDisconnected)
