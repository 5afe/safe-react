import * as React from 'react'

import styled from 'styled-components'
import { Card, Button, Title, Text, Divider, ButtonLink, Dot } from '@gnosis.pm/safe-react-components'

import Block from 'src/components/layout/Block'
// import { LOAD_ADDRESS, OPEN_ADDRESS } from 'src/routes/routes'
import { onConnectButtonClick } from 'src/components/ConnectButton'

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

type Props = {
  isOldMultisigMigration?: boolean
  provider: any
}

const Welcome = ({ isOldMultisigMigration, provider }: Props): React.ReactElement => {
  return (
    <Block>
      {/* Title */}
      <Title size="md" strong withoutMargin>
        Welcome to Gnosis Safe Multisig.
      </Title>

      {/* Subtitle */}
      <Title size="xs">
        {isOldMultisigMigration ? (
          <>
            We will replicate the owner structure from your existing Gnosis MultiSig to let you test the new interface.
            As soon as you feel comfortable, start moving funds to your new Safe.
          </>
        ) : (
          <>
            Gnosis Safe Multisig is the most trusted platform to manage digital assets. <br /> Here is how to get
            started:{' '}
          </>
        )}
      </Title>

      <>
        <Wrapper>
          {/* Connect wallet */}
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
              Gnosis Safe Multisig supports a wide range of wallets that you can choose to be one of the authentication
              factors.
            </Text>
            <StyledButtonLink textSize="xl" color="primary" iconType="externalLink">
              Why do I need to connect wallet?
            </StyledButtonLink>
            <Button
              size="lg"
              color="primary"
              variant="contained"
              onClick={onConnectButtonClick}
              data-testid="connect-btn"
            >
              <Text size="xl" color="white">
                Connect wallet
              </Text>
            </Button>
          </StyledCard>

          <StyledCardDouble>
            {/* Create safe */}
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
              <Button size="lg" color="primary" variant="contained" disabled={!provider}>
                <Text size="xl" color="white">
                  + Create new Safe
                </Text>
              </Button>
            </CardsCol>

            <Divider orientation="vertical" />

            {/* Load safe */}
            <CardsCol>
              <StyledTitleOnly size="sm" strong withoutMargin>
                Load existing Safe
              </StyledTitleOnly>
              <Text size="xl">
                Already have a Safe? Do you want to access your Safe Multisig from a different device? Easily load your
                Safe Multisig using your Safe address.
              </Text>
              <Button
                variant="bordered"
                iconType="safe"
                iconSize="sm"
                size="lg"
                color="secondary"
                onClick={() => alert('click')}
                disabled={!provider}
              >
                <Text size="xl" color="secondary">
                  Load existing Safe
                </Text>
              </Button>
            </CardsCol>
          </StyledCardDouble>
        </Wrapper>
      </>
    </Block>
  )
}

export default Welcome
