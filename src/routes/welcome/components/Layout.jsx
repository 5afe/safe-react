// @flow
import * as React from 'react'
import OpenInNew from '@material-ui/icons/OpenInNew'
import Block from '~/components/layout/Block'
import Heading from '~/components/layout/Heading'
import Img from '~/components/layout/Img'
import Button from '~/components/layout/Button'
import Link from '~/components/layout/Link'
import ConnectButton from '~/components/ConnectButton'
import { OPEN_ADDRESS, LOAD_ADDRESS } from '~/routes/routes'
import { marginButtonImg, secondary } from '~/theme/variables'
import styles from './Layout.scss'

const safe = require('../assets/safe.svg')
const plus = require('../assets/new.svg')

type Props = {
  provider: string
}

const openIconStyle = {
  height: '13px',
  color: secondary,
  marginBottom: '-2px',
}

type SafeProps = {
  provider: string,
  size?: "small" | "medium" | "large"
}

const buttonStyle = {
  marginLeft: marginButtonImg,
}

export const CreateSafe = ({ size, provider }: SafeProps) => (
  <Button
    component={Link}
    to={OPEN_ADDRESS}
    variant="contained"
    size={size || 'medium'}
    color="primary"
    disabled={!provider}
    minWidth={240}
    minHeight={42}
  >
    <Img src={plus} height={14} alt="Safe" />
    <div style={buttonStyle}>Create new Safe</div>
  </Button>
)

export const LoadSafe = ({ size, provider }: SafeProps) => (
  <Button
    component={Link}
    to={LOAD_ADDRESS}
    variant="outlined"
    size={size || 'medium'}
    color="primary"
    disabled={!provider}
    minWidth={240}
  >
    <Img src={safe} height={14} alt="Safe" />
    <div style={buttonStyle}>Load existing Safe</div>
  </Button>
)

const Welcome = ({ provider }: Props) => (
  <Block className={styles.safe}>
    <Heading tag="h1" weight="bold" align="center" margin="lg">
      Welcome to
      <br />
      Gnosis Safe For Teams
    </Heading>
    <Heading tag="h3" align="center" margin="xl">
      Gnosis Safe for Teams is the most secure way to manage crypto funds
      <br />
      collectively. It is an improvement of the Gnosis MultiSig, which is used
      by more than 3000 teams
      <br />
      {' '}
      and stores over $1B USD worth of digital assets. Gnosis Safe for
      Teams features a modular
      <br />
      {' '}
      design, formally verified smart contracts and vastly improved user
      experience.
      {' '}
      <a
        className={styles.learnMoreLink}
        href="https://safe.gnosis.io/teams"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn more
        <OpenInNew style={openIconStyle} />
      </a>
    </Heading>
    {provider ? (
      <>
        <Block className={styles.safeActions} margin="md">
          <CreateSafe size="large" provider={provider} />
        </Block>
        <Block className={styles.safeActions} margin="md">
          <LoadSafe size="large" provider={provider} />
        </Block>
      </>
    ) : (
      <Block margin="md" className={styles.connectWallet}>
        <Heading tag="h3" align="center" margin="md">
          Get Started by Connecting a Wallet
        </Heading>
        <ConnectButton minWidth={240} minHeight={42} />
      </Block>
    )}
  </Block>
)

export default Welcome
