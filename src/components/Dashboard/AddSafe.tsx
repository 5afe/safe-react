import { ReactElement } from 'react'
import styled from 'styled-components'
import { Button, Title, Text } from '@gnosis.pm/safe-react-components'

import Link from 'src/components/layout/Link'
import { LOAD_SAFE_ROUTE } from 'src/routes/routes'
import Track from 'src/components/Track'
import { LOAD_SAFE_EVENTS } from 'src/utils/events/createLoadSafe'
import { CardContentContainer, CardDescriptionContainer } from './CreateSafe'

const StyledButtonLabel = styled(Text)`
  min-width: 130px;
`

const AddSafeWidget = (): ReactElement => {
  return (
    <CardContentContainer>
      <Title size="sm" strong withoutMargin>
        Load Existing Safe
      </Title>
      <CardDescriptionContainer>
        <Text size="xl">
          Already have a Safe or want to access it from a different device? Easily load your Safe using your Safe
          address.
        </Text>
      </CardDescriptionContainer>
      <Track {...LOAD_SAFE_EVENTS.LOAD_BUTTON}>
        <Button
          variant="bordered"
          iconType="safe"
          iconSize="sm"
          size="lg"
          color="secondary"
          component={Link}
          to={LOAD_SAFE_ROUTE}
        >
          <StyledButtonLabel size="xl" color="secondary">
            Add existing Safe
          </StyledButtonLabel>
        </Button>
      </Track>
    </CardContentContainer>
  )
}

export default AddSafeWidget
