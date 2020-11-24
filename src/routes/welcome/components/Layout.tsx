import * as React from 'react'

import styles from './Layout.module.scss'
import { Card, Title, Text, Divider, ButtonLink } from '@gnosis.pm/safe-react-components'

import ConnectButton from 'src/components/ConnectButton'
import Block from 'src/components/layout/Block'
import Button from 'src/components/layout/Button'
import Heading from 'src/components/layout/Heading'
import Img from 'src/components/layout/Img'
import Link from 'src/components/layout/Link'
import { LOAD_ADDRESS, OPEN_ADDRESS } from 'src/routes/routes'
import { marginButtonImg } from 'src/theme/variables'
import styled from 'styled-components'

const plus = require('../assets/new.svg')
const safe = require('../assets/safe.svg')

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`
const StyledCardDouble = styled(Card)`
  display: flex;
  padding: 0;
`

const StyledCard = styled(Card)`
  margin: 0 20px 0 0;
  max-width: 33%;
`
const CardsCol = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px;
  width: 50%;
`

/* const StyledDoubleCard = styled(Card)`
  display: inline-block;
  margin: 0 20px 0 0;
  position: relative;
`

const StyledDivider = styled(Divider)`
  left: 50%;
  position: absolute;
  margin: -24px 0 0 0;
`  */

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin: 0 0 16px 0;

  h5 {
    margin: 0 16px;
  }
`

const Dot = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  height: 36px;
  width: 36px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
`
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
      We will replicate the owner structure from your existing Gnosis MultiSig to let you test the new interface. As
      soon as you feel comfortable, start moving funds to your new Safe.
    </>
  ) : (
    <>
      Gnosis Safe Multisig is the most trusted platform to manage <br /> digital assets on Ethereum. Here is how to get
      started:{' '}
    </>
  )
  return (
    <Block className={styles.safe}>
      <Title size="md">Welcome to Gnosis Safe Multisig</Title>
      {/* <Heading align="center" margin="lg" tag="h1" weight="bold">
        Welcome to Gnosis Safe Multisig
      </Heading> */}
      <Title size="xs">{headingText}</Title>

      {/* <Heading align="center" margin="xl" tag="h3">
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
      </Heading> */}
      {provider ? (
        <>
          <Wrapper>
            <StyledCard>
              <TitleWrapper>
                <Dot>
                  <Title size="xs">1</Title>
                </Dot>
                <Title size="xs">Connect wallet</Title>
              </TitleWrapper>
              <Text size="xl">
                Gnosis Safe Multisig supports a wide range of wallets that you can choose to be one of the
                authentication factors.
              </Text>
              <ButtonLink textSize="xl" color="primary" iconType="externalLink">
                Why do I need to connect wallet?
              </ButtonLink>
              <Block className={styles.LoadSafe} margin="md" padding="lg">
                <LoadSafe provider={provider} size="large" />
              </Block>
            </StyledCard>
            <StyledCardDouble>
              <CardsCol>
                <TitleWrapper>
                  <Dot>
                    <Title size="xs">2</Title>
                  </Dot>
                  <Title size="xs">Create Safe</Title>
                </TitleWrapper>
                <Text size="xl">
                  Create a new Safe Multisig that is controlled by one or multiple owners. <br />
                  You will be required to pay a network fee for creating your new Safe.
                </Text>
                <Block className={styles.safeActions} margin="md">
                  <CreateSafe provider={provider} size="large" />
                </Block>
              </CardsCol>
              <Divider orientation="vertical" />
              <CardsCol>
                <Title size="xs">Load existing Safe</Title>
                <Text size="xl">
                  Already have a Safe? Do you want to access your Safe Multisig from a different device? Easily load
                  your Safe Multisig using your Safe address.
                </Text>
                <Block className={styles.safeActions} margin="md">
                  <LoadSafe provider={provider} size="large" />
                </Block>
              </CardsCol>
            </StyledCardDouble>
          </Wrapper>
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
