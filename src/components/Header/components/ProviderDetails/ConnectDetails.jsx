// @flow
import { withStyles } from '@material-ui/core/styles'
import * as React from 'react'

import ConnectButton from '~/components/ConnectButton'
import CircleDot from '~/components/Header/components/CircleDot'
import Block from '~/components/layout/Block'
import Paragraph from '~/components/layout/Paragraph'
import Row from '~/components/layout/Row'
import { lg, md } from '~/theme/variables'

type Props = {
  classes: Object,
}

const styles = () => ({
  container: {
    padding: `${md} 12px`,
  },
  logo: {
    justifyContent: 'center',
  },
  text: {
    letterSpacing: '-0.6px',
    flexGrow: 1,
    textAlign: 'center',
  },
  connect: {
    padding: `${md} ${lg}`,
    textAlign: 'center',
  },
  connectText: {
    letterSpacing: '1px',
  },
  img: {
    margin: '0px 2px',
  },
})

const ConnectDetails = ({ classes }: Props) => (
  <>
    <div className={classes.container}>
      <Row align="center" margin="lg">
        <Paragraph className={classes.text} noMargin size="lg" weight="bolder">
          Connect a Wallet
        </Paragraph>
      </Row>
    </div>
    <Row className={classes.logo} margin="lg">
      <CircleDot center circleSize={75} dotRight={25} dotSize={25} dotTop={50} keySize={32} mode="error" />
    </Row>
    <Block className={classes.connect}>
      <ConnectButton />
    </Block>
  </>
)

export default withStyles(styles)(ConnectDetails)
