import { makeStyles } from '@material-ui/core/styles'
import * as React from 'react'

import NetworkLabel from '../NetworkLabel'
import CircleDot from 'src/components/Header/components/CircleDot'
import Identicon from 'src/components/Identicon'
import Col from 'src/components/layout/Col'
import Paragraph from 'src/components/layout/Paragraph'
import { shortVersionOf } from 'src/logic/wallets/ethAddresses'
import WalletIcon from '../WalletIcon'
import { connected as connectedBg, screenSm, sm } from 'src/theme/variables'

const useStyles = makeStyles({
  network: {
    fontFamily: 'Averta, sans-serif',
  },
  networkLabel: {
    '& div': {
      paddingRight: sm,
      paddingLeft: sm,
    },
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
  providerContainer: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    width: '100px',
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
    marginLeft: '5px',
    letterSpacing: '-0.5px',
  },
})

interface ProviderInfoProps {
  connected: boolean
  provider: string
  userAddress: string
}

const ProviderInfo = ({ connected, provider, userAddress }: ProviderInfoProps): React.ReactElement => {
  const classes = useStyles()
  const cutAddress = connected ? shortVersionOf(userAddress, 4) : 'Connection Error'
  const color = connected ? 'primary' : 'warning'
  const identiconAddress = userAddress || 'random'

  return (
    <>
      {!connected && <CircleDot circleSize={35} dotRight={11} dotSize={16} dotTop={24} keySize={14} mode="warning" />}
      <WalletIcon provider={provider.toUpperCase()} />
      <Col className={classes.account} layout="column" start="sm">
        <Paragraph
          className={classes.network}
          noMargin
          size="xs"
          transform="capitalize"
          weight="bolder"
          data-testid="connected-wallet"
        >
          {provider}
        </Paragraph>
        <div className={classes.providerContainer}>
          {connected && <Identicon address={identiconAddress} className={classes.identicon} diameter={10} />}
          <Paragraph className={classes.address} color={color} noMargin size="xs">
            {cutAddress}
          </Paragraph>
        </div>
      </Col>
      <Col className={classes.networkLabel} layout="column" start="sm">
        <NetworkLabel />
      </Col>
    </>
  )
}

export default ProviderInfo
