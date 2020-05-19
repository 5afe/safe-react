//
import OpenInNew from '@material-ui/icons/OpenInNew'
import * as React from 'react'

import styles from './Layout.module.scss'

import ConnectButton from 'components/ConnectButton'
import Block from 'components/layout/Block'
import Button from 'components/layout/Button'
import Heading from 'components/layout/Heading'
import Img from 'components/layout/Img'
import Link from 'components/layout/Link'
import { LOAD_ADDRESS, OPEN_ADDRESS } from 'routes/routes'
import { marginButtonImg, secondary } from 'theme/variables'

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

export const CreateSafe = ({ provider, size }) => (
  <Button
    color="primary"
    component={Link}
    disabled={!provider}
    minHeight={42}
    minWidth={240}
    size={size || 'medium'}
    to={OPEN_ADDRESS}
    variant="contained"
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
  >
    <Img alt="Safe" height={14} src={safe} />
    <div style={buttonStyle}>Load existing Safe</div>
  </Button>
)

const Welcome = ({ isOldMultisigMigration, provider }) => {
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
          href="https://safe.gnosis.io/teams"
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
          <ConnectButton minHeight={42} minWidth={240} />
        </Block>
      )}
    </Block>
  )
}

export default Welcome
