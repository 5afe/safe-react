// @flow
import * as React from 'react'
import Web3Connect from 'web3connect'
import Block from '~/components/layout/Block'
import Heading from '~/components/layout/Heading'
import Img from '~/components/layout/Img'
import Paragraph from '~/components/layout/Paragraph'
import Button from '~/components/layout/Button'
import Link from '~/components/layout/Link'
import Web3Integration from '~/logic/wallets/web3Integration'
import { OPEN_ADDRESS, LOAD_ADDRESS } from '~/routes/routes'
import { marginButtonImg } from '~/theme/variables'
import styles from './Layout.scss'

const safe = require('../assets/safe.svg')
const plus = require('../assets/new.svg')

type Props = {
  provider: string,
}

type SafeProps = {
  provider: string,
  size?: 'small' | 'medium' | 'large',
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
    <Heading tag="h1" align="center" margin="lg">
      Welcome to the Gnosis
      <br />
      Safe Team Edition
    </Heading>
    <Paragraph align="center" margin="xl">
      The Gnosis Safe Team Edition is geared towards teams managing
      <br />
      shared crypto funds. It is an improvement of the existing Gnosis
      <br />
      MultiSig wallet with redesigned smart contracts, cheaper setup and
      <br />
      transaction costs as well as an enhanced user experience.
    </Paragraph>
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
      <Block className={styles.connectWallet} margin="md">
        <Heading tag="h3" align="center" margin="md">
          Get Started by Connecting a Wallet
        </Heading>
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
          onConnect={(connectedProvider: any) => {
            Web3Integration.setWeb3(connectedProvider)
          }}
        />
      </Block>
    )}
  </Block>
)

export default Welcome
