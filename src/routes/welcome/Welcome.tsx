import { ReactElement } from 'react'
import { Button } from '@gnosis.pm/safe-react-components'
import Divider from '@material-ui/core/Divider'
import styled from 'styled-components'

import Page from 'src/components/layout/Page'
import Block from 'src/components/layout/Block'
import Link from 'src/components/layout/Link'
import { LOAD_SAFE_ROUTE, OPEN_SAFE_ROUTE } from 'src/routes/routes'
import Track from 'src/components/Track'
import { CREATE_SAFE_EVENTS, LOAD_SAFE_EVENTS } from 'src/utils/events/createLoadSafe'
import { soliditySha3 } from 'web3-utils'
import { border } from 'src/theme/variables'

function Welcome(): ReactElement {
  return (
    <Page align="center">
      <Block>
        <Title>Welcome to the Safe.</Title>
        <SubTitle>
          Safe is the most trusted platform to manage digital assets. <br /> Here is how to get started:
        </SubTitle>
        <CardsContainer>
          <StyledCard>
            {/* Create Safe */}
            <CardContentContainer>
              <Title>Create Safe</Title>
              <CardDescriptionContainer>
                <Text>Create a new Safe that is controlled by one or multiple owners.</Text>
                <Text>You will be required to pay a network fee for creating your new Safe.</Text>
              </CardDescriptionContainer>
              <Track {...CREATE_SAFE_EVENTS.CREATE_BUTTON}>
                <Button size="lg" color="primary" variant="contained" component={Link} to={OPEN_SAFE_ROUTE}
                style={{
                  background: "#06fc99",
                }}>
                  <CreateNewLabel>+ Create new Safe</CreateNewLabel>
                </Button>
              </Track>
            </CardContentContainer>
            <Divider orientation="vertical" flexItem />
            <CardContentContainer>
              {/* Load Safe */}
              <Title>Load Existing Safe</Title>
              <CardDescriptionContainer>
                <Text>
                  Already have a Safe or want to access it from a different device? Easily load your Safe using your
                  Safe address.
                </Text>
              </CardDescriptionContainer>
              <Track {...LOAD_SAFE_EVENTS.LOAD_BUTTON}>
                
                <Button
                  variant="bordered"
                  size="lg"
                  component={Link}
                  to={LOAD_SAFE_ROUTE}
                  style={{
                    outline: "0",
                    border: "2px solid #06fc99"
                  }}
                >
                  <StyledButtonLabel color="secondary">Add existing Safe</StyledButtonLabel>
                </Button>
              </Track>
            </CardContentContainer>
          </StyledCard>
        </CardsContainer>
      </Block>
    </Page>
  )
}

export default Welcome

const Title = styled.div`
  color: #06fc99;
  font-size: 2rem;
`

const SubTitle = styled.div`
  color: #06fc99;
  font-size: 1rem;
`

const Text = styled.p`
  color: #06fc99;
`
const CardsContainer = styled.div`
  display: flex;
  height: 300px;
  max-width: 850px;
  margin-top: 2rem;
  padding: 1rem 0;
  border: 2px solid #06fc99;
  border-radius: 1rem;
`

const StyledCard = styled.div`
  display: flex;
  flex: 0 1 100%;
  padding: 0;
  background-color: transparent;
`

const CardContentContainer = styled.div`
  flex: 1 1 50%;
  display: flex;
  flex-direction: column;
  padding: 24px;
  align-items: flex-start;
`

const CreateNewLabel = styled(Text)`
  color: #000;
  font-family: 'IBM Plex Mono', monospace;
`
const StyledButtonLabel = styled(Text)`
  min-width: 130px;
  color: #06fc99;
  font-family: 'IBM Plex Mono', monospace;

`

const CardDescriptionContainer = styled.div`
  margin-top: 16px;
  margin-bottom: auto;
`
