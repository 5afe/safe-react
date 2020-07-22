import OpenInNew from '@material-ui/icons/OpenInNew'
import * as React from 'react'

import styles from './Layout.module.scss'

import ConnectButton from 'src/components/ConnectButton'
import Block from 'src/components/layout/Block'
import Button from 'src/components/layout/Button'
import Heading from 'src/components/layout/Heading'
import Img from 'src/components/layout/Img'
import Link from 'src/components/layout/Link'
import { LOAD_ADDRESS, OPEN_ADDRESS } from 'src/routes/routes'
import { marginButtonImg, secondary } from 'src/theme/variables'

const plus = require('../assets/new.svg')
const safe = require('../assets/safe.svg')

const openIconStyle = {
  height: '13px',
  color: secondary,
  marginBottom: '-2px',
}

const buttonStyle = {
  marginLeft: marginButtonImg,
}

export const CreateSafe = ({ provider, size }: any) => (
  <Button
    color="primary"
    component={Link}
    disabled={!provider}
    minHeight={42}
    minWidth={240}
    size={size || 'medium'}
    to={OPEN_ADDRESS}
    variant="contained"
    testId="create-new-safe-btn"
  >
    <Img alt="Safe" height={14} src={plus} />
    <div style={buttonStyle}>Create new Safe</div>
  </Button>
)

export const LoadSafe = ({ provider, size }) => (
  <Button
    color="primary"
    component={Link}
    disabled={!provider}
    minWidth={240}
    size={size || 'medium'}
    to={LOAD_ADDRESS}
    variant="outlined"
    testId="load-existing-safe-btn"
  >
    <Img alt="Safe" height={14} src={safe} />
    <div style={buttonStyle}>Load existing Safe</div>
  </Button>
)

const Welcome = ({ isOldMultisigMigration, provider }: any) => {
  const headingText = isOldMultisigMigration ? (
    <>
      We will replicate the owner structure from your existing Gnosis MultiSig
      <br />
      to let you test the new interface.
      <br />
      As soon as you feel comfortable, start moving funds to your new Safe.
      <br />{' '}
    </>
  ) : (
    <>
      Gnosis Safe Multisig is the most secure way to manage crypto funds
      <br />
      collectively. It is an improvement of the Gnosis MultiSig, which is used by more than 3000 teams
      <br /> and stores over $1B USD worth of digital assets. Gnosis Safe Multisig features a modular
      <br /> design, formally verified smart contracts and vastly improved user experience.{' '}
    </>
  )
  return (
    <Block className={styles.safe}>
      <Heading align="center" margin="lg" tag="h1" weight="bold">
        Welcome to
        <br />
        Gnosis Safe Multisig
      </Heading>
      <Heading align="center" margin="xl" tag="h3">
        {headingText}
        <a
          className={styles.learnMoreLink}
          href="https://gnosis-safe.io/teams"
          rel="noopener noreferrer"
          target="_blank"
        >
          Learn more
          <OpenInNew style={openIconStyle} />
        </a>
      </Heading>
      {provider ? (
        <>
          <Block className={styles.safeActions} margin="md">
            <CreateSafe provider={provider} size="large" />
          </Block>
          <Block className={styles.safeActions} margin="md">
            <LoadSafe provider={provider} size="large" />
          </Block>
        </>
      ) : (
        <Block className={styles.connectWallet} margin="md">
          <Heading align="center" margin="md" tag="h3">
            Get Started by Connecting a Wallet
          </Heading>
          <ConnectButton minHeight={42} minWidth={240} data-testid="connect-btn" />
        </Block>
      )}
    </Block>
  )
}

export default Welcome
