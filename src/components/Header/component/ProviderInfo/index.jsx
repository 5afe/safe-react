// @flow
import * as React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Paragraph from '~/components/layout/Paragraph'
import Col from '~/components/layout/Col'
import Img from '~/components/layout/Img'
import { sm } from '~/theme/variables'
import Identicon from '~/components/Identicon'
import { shortVersionOf } from '~/logic/wallets/ethAddresses'

const connectedLogo = require('../../assets/connected.svg')

type Props = {
  provider: string,
  network: string,
  classes: Object,
  userAddress: string,
  connected: boolean,
}

const styles = () => ({
  network: {
    fontFamily: 'Montserrat, sans-serif',
  },
  logo: {
    top: '10px',
    position: 'relative',
    right: '13px',
  },
  account: {
    paddingRight: sm,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    flexGrow: 1,
  },
  address: {
    letterSpacing: '-0.5px',
  },
})

const ProviderInfo = ({
  provider, network, userAddress, connected, classes,
}: Props) => {
  const providerText = connected ? `${provider} [${network}]` : 'Not connected'
  const cutAddress = connected ? shortVersionOf(userAddress, 6) : ''

  return (
    <React.Fragment>
      <Identicon address={userAddress} diameter={30} />
      <Img className={classes.logo} src={connectedLogo} height={20} alt="Status connected" />
      <Col end="sm" middle="xs" layout="column" className={classes.account}>
        <Paragraph size="sm" transform="capitalize" className={classes.network} noMargin weight="bold">{providerText}</Paragraph>
        <Paragraph size="sm" className={classes.address} noMargin>{cutAddress}</Paragraph>
      </Col>
    </React.Fragment>
  )
}

export default withStyles(styles)(ProviderInfo)
