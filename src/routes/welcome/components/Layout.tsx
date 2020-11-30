import * as React from 'react'

import styles from './Layout.module.scss'
import { Card, Title, Text, Divider, ButtonLink, Dot } from '@gnosis.pm/safe-react-components'

import ConnectButton from 'src/components/ConnectButton'
/* import Dot from 'src/routes/safe/components/Dot' */
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
`
const StyledCardDouble = styled(Card)`
  display: flex;
  padding: 0;
`
const StyledCard = styled(Card)`
  margin: 0 20px 0 0;
  max-width: 33%;
  display: flex;
  flex-direction: column;
`
const CardsCol = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px;
  width: 50%;
`
const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin: 0 0 16px 0;

  h5 {
    color: white;
  }
`
const StyledTitle = styled(Title)`
  margin: 0 0 0 16px;
`
const StyledTitleOnly = styled(Title)`
  margin: 0 0 16px 0;
`
const StyledButtonLink = styled(ButtonLink)`
  margin: 16px 0 0 -8px;
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
      Gnosis Safe Multisig is the most trusted platform to manage digital assets. <br /> Here is how to get started:{' '}
    </>
  )
  return (
    <Block className={styles.safe}>
      <Title size="md" strong withoutMargin>
        Welcome to Gnosis Safe Multisig.
      </Title>
      <Title size="xs">{headingText}</Title>

      {provider ? (
        <>
          <Wrapper>
            <StyledCard>
              <TitleWrapper>
                <Dot color="primary">
                  <Title size="xs">1</Title>
                </Dot>
                <StyledTitle size="sm" strong withoutMargin>
                  Connect wallet
                </StyledTitle>
              </TitleWrapper>
              <Text size="xl">
                Gnosis Safe Multisig supports a wide range of wallets that you can choose to be one of the
                authentication factors.
              </Text>
              <StyledButtonLink textSize="xl" color="primary" iconType="externalLink">
                Why do I need to connect wallet?
              </StyledButtonLink>
              <Button size="lg" color="primary" variant="contained">
                <Text size="xl" color="white">
                  Connect wallet
                </Text>
              </Button>
              <Block className={styles.LoadSafe} margin="md" padding="lg">
                <LoadSafe provider={provider} size="large" />
              </Block>
            </StyledCard>
            <StyledCardDouble>
              <CardsCol>
                <TitleWrapper>
                  <Dot color="primary">
                    <Title size="xs">2</Title>
                  </Dot>
                  <StyledTitle size="sm" strong withoutMargin>
                    Create Safe
                  </StyledTitle>
                </TitleWrapper>
                <Text size="xl">
                  Create a new Safe Multisig that is controlled by one or multiple owners. <br />
                  You will be required to pay a network fee for creating your new Safe.
                </Text>
                <Button size="lg" color="primary" variant="contained">
                  <Text size="xl" color="white">
                    + Create new Safe
                  </Text>
                </Button>
                <Block className={styles.safeActions} margin="md">
                  <CreateSafe provider={provider} size="large" />
                </Block>
              </CardsCol>
              <Divider orientation="vertical" />
              <CardsCol>
                <StyledTitleOnly size="sm" strong withoutMargin>
                  Load existing Safe
                </StyledTitleOnly>
                <Text size="xl">
                  Already have a Safe? Do you want to access your Safe Multisig from a different device? Easily load
                  your Safe Multisig using your Safe address.
                </Text>
                <Button
                  variant="bordered"
                  iconType="safe"
                  iconSize="sm"
                  size="lg"
                  color="secondary"
                  onClick={() => alert('click')}
                >
                  <Text size="xl" color="secondary">
                    Load existing Safe
                  </Text>
                </Button>
                <Block className={styles.safeActions} margin="md">
                  <LoadSafe provider={provider} size="large" />
                </Block>
              </CardsCol>
            </StyledCardDouble>
          </Wrapper>
        </>
      ) : (
        <Block className={styles.connectWallet} margin="md">
          <Heading align="left" margin="md" tag="h3">
            Get Started by Connecting a Wallet
          </Heading>
          <ConnectButton minHeight={42} minWidth={240} data-testid="connect-btn" />
        </Block>
      )}
    </Block>
  )
}

export default Welcome
