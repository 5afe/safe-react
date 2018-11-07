// @flow
import * as React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Paragraph from '~/components/layout/Paragraph'
import Col from '~/components/layout/Col'
import Dot from '@material-ui/icons/FiberManualRecord'
import { connected as connectedBg, sm } from '~/theme/variables'
import Identicon from '~/components/Identicon'
import { shortVersionOf } from '~/logic/wallets/ethAddresses'
import CircleDot from '~/components/Header/component/CircleDot'

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
    height: '15px',
    width: '15px',
    top: '12px',
    position: 'relative',
    right: '10px',
    backgroundColor: '#ffffff',
    borderRadius: '15px',
    color: connectedBg,
  },
  account: {
    paddingRight: sm,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'left',
    alignItems: 'start',
    flexGrow: 1,
  },
  address: {
    letterSpacing: '-0.5px',
  },
})

const ProviderInfo = ({
  provider, network, userAddress, connected, classes,
}: Props) => {
  const providerText = `${provider} [${network}]`
  const cutAddress = connected ? shortVersionOf(userAddress, 6) : 'Connection Error'
  const color = connected ? 'primary' : 'warning'
  const identiconAddress = userAddress || 'random'

  return (
    <React.Fragment>
      { connected &&
        <React.Fragment>
          <Identicon address={identiconAddress} diameter={30} />
          <Dot className={classes.logo} />
        </React.Fragment>
      }
      { !connected &&
        <CircleDot keySize={14} circleSize={35} dotSize={16} dotTop={24} dotRight={11} mode="warning" />
      }
      <Col start="sm" layout="column" className={classes.account}>
        <Paragraph size="sm" transform="capitalize" className={classes.network} noMargin weight="bolder">{providerText}</Paragraph>
        <Paragraph size="sm" className={classes.address} noMargin color={color}>{cutAddress}</Paragraph>
      </Col>
    </React.Fragment>
  )
}

export default withStyles(styles)(ProviderInfo)
