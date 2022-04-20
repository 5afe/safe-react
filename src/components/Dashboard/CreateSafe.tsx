import { ReactElement } from 'react'
import styled from 'styled-components'
import { Button, Text } from '@gnosis.pm/safe-react-components'
import Link from 'src/components/layout/Link'
import Track from 'src/components/Track'
import { OPEN_SAFE_ROUTE } from 'src/routes/routes'
import { CREATE_SAFE_EVENTS } from 'src/utils/events/createLoadSafe'
import { Card, WidgetBody, WidgetContainer, WidgetTitle } from 'src/components/Dashboard/styled'

export const CardContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

export const CardDescriptionContainer = styled.div`
  flex: 1;
  margin: 1.5em 0;
`

const CreateSafeWidget = (): ReactElement => {
  return (
    <WidgetContainer>
      <WidgetTitle>Create Safe</WidgetTitle>
      <WidgetBody>
        <Card>
          <CardDescriptionContainer>
            <Text size="xl">Create a new Safe that is controlled by one or multiple owners.</Text>
            <Text size="xl">You will be required to pay a network fee for creating your new Safe.</Text>
          </CardDescriptionContainer>

          <Track {...CREATE_SAFE_EVENTS.CREATE_BUTTON}>
            <Button size="lg" color="primary" variant="contained" component={Link} to={OPEN_SAFE_ROUTE}>
              <Text size="xl" color="white">
                + Create new Safe
              </Text>
            </Button>
          </Track>
        </Card>
      </WidgetBody>
    </WidgetContainer>
  )
}

export default CreateSafeWidget
