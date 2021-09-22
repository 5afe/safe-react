import { ReactElement } from 'react'
import { Button, Card, Title, Text } from '@gnosis.pm/safe-react-components'
import styled from 'styled-components'

import Page from 'src/components/layout/Page'
import Block from 'src/components/layout/Block'
import Link from 'src/components/layout/Link'
import { LOAD_ADDRESS, OPEN_ADDRESS } from 'src/routes/routes'

function Welcome(): ReactElement {
  return (
    <Page align="center">
      <Block>
        <Title size="md" strong>
          Welcome to Gnosis Safe.
        </Title>
        <Title size="xs">
          Gnosis Safe is the most trusted platform to manage digital assets. <br /> Here is how to get started:
        </Title>
        <CardsContainer>
          {/* Create Safe Card */}
          <StyledCard>
            <Title size="sm" strong withoutMargin>
              Create Safe
            </Title>
            <CardDescriptionContainer>
              <Text size="xl">Create a new Safe Multisig that is controlled by one or multiple owners.</Text>
              <Text size="xl">You will be required to pay a network fee for creating your new Safe.</Text>
            </CardDescriptionContainer>
            <Button size="lg" color="primary" variant="contained" component={Link} to={OPEN_ADDRESS}>
              <Text size="xl" color="white">
                + Create new Safe
              </Text>
            </Button>
          </StyledCard>
          {/* Load Safe Card */}
          <StyledCard>
            <Title size="sm" strong withoutMargin>
              Load Existing Safe
            </Title>
            <CardDescriptionContainer>
              <Text size="xl">
                Already have a Safe or want to access it from a different device? Easily load your Safe MultiSig using
                your Safe address.
              </Text>
            </CardDescriptionContainer>
            <Button
              variant="bordered"
              iconType="safe"
              iconSize="sm"
              size="lg"
              color="secondary"
              component={Link}
              to={LOAD_ADDRESS}
            >
              <Text size="xl" color="secondary">
                Add existing Safe
              </Text>
            </Button>
          </StyledCard>
        </CardsContainer>
      </Block>
    </Page>
  )
}

export default Welcome

const CardsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  height: 300px;
  max-width: 1200px;
`

const StyledCard = styled(Card)`
  display: flex;
  flex: 0 1 36%;
  flex-direction: column;
  padding: 24px;
  align-items: flex-start;
`

const CardDescriptionContainer = styled.div`
  margin-top: 16px;
  margin-bottom: auto;
`
