// @flow
import * as React from 'react'
import Web3Connect from 'web3connect'
import { withStyles } from '@material-ui/core/styles'
import Paragraph from '~/components/layout/Paragraph'
import Web3Integration from '~/logic/wallets/web3Integration'
import Row from '~/components/layout/Row'
import { md, lg } from '~/theme/variables'
import CircleDot from '~/components/Header/component/CircleDot'

type Props = {
  classes: Object,
  onConnect: Function,
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
  },
  connectText: {
    letterSpacing: '1px',
  },
  img: {
    margin: '0px 2px',
  },
})

const ConnectDetails = ({ classes, onConnect }: Props) => (
  <React.Fragment>
    <div className={classes.container}>
      <Row margin="lg" align="center">
        <Paragraph className={classes.text} size="lg" noMargin weight="bolder">
          Connect a Wallet
        </Paragraph>
      </Row>
    </div>
    <Row className={classes.logo} margin="lg">
      <CircleDot keySize={32} circleSize={75} dotSize={25} dotTop={50} dotRight={25} center mode="error" />
    </Row>
    <Row className={classes.connect}>
      <Web3Connect.Button
        providerOptions={{
          portis: {
            id: 'PORTIS_ID', // required
            network: 'mainnet', // optional
          },
          fortmatic: {
            key: 'FORTMATIC_KEY', // required
            network: 'mainnet', // optional
          },
        }}
        onConnect={(provider: any) => {
          onConnect(provider)
        }}
      />
    </Row>
  </React.Fragment>
)

export default withStyles(styles)(ConnectDetails)
