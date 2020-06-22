import { withStyles } from '@material-ui/core/styles'
import Dot from '@material-ui/icons/FiberManualRecord'
import * as React from 'react'

import CircleDot from 'src/components/Header/components/CircleDot'
import Identicon from 'src/components/Identicon'
import Col from 'src/components/layout/Col'
import Paragraph from 'src/components/layout/Paragraph'
import { shortVersionOf } from 'src/logic/wallets/ethAddresses'
import { connected as connectedBg, screenSm, sm } from 'src/theme/variables'

const styles = () => ({
  network: {
    fontFamily: 'Averta, sans-serif',
  },
  identicon: {
    display: 'none',
    [`@media (min-width: ${screenSm}px)`]: {
      display: 'block',
    },
  },
  dot: {
    backgroundColor: '#fff',
    borderRadius: '15px',
    color: connectedBg,
    display: 'none',
    height: '15px',
    position: 'relative',
    right: '10px',
    top: '12px',
    width: '15px',
    [`@media (min-width: ${screenSm}px)`]: {
      display: 'block',
    },
  },
  account: {
    alignItems: 'start',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    justifyContent: 'left',
    paddingRight: sm,
  },
  address: {
    letterSpacing: '-0.5px',
  },
})

const ProviderInfo = ({ classes, connected, network, provider, userAddress }) => {
  const providerText = `${provider} [${network}]`
  const cutAddress = connected ? shortVersionOf(userAddress, 4) : 'Connection Error'
  const color = connected ? 'primary' : 'warning'
  const identiconAddress = userAddress || 'random'

  return (
    <>
      {connected && (
        <>
          <Identicon address={identiconAddress} className={classes.identicon} diameter={30} />
          <Dot className={classes.dot} />
        </>
      )}
      {!connected && <CircleDot circleSize={35} dotRight={11} dotSize={16} dotTop={24} keySize={14} mode="warning" />}
      <Col className={classes.account} layout="column" start="sm">
        <Paragraph
          className={classes.network}
          noMargin
          size="xs"
          transform="capitalize"
          weight="bolder"
          data-testid="connected-wallet"
        >
          {providerText}
        </Paragraph>
        <Paragraph className={classes.address} color={color} noMargin size="xs">
          {cutAddress}
        </Paragraph>
      </Col>
    </>
  )
}

export default withStyles(styles as any)(ProviderInfo)
