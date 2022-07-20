import { ReactElement } from 'react'
import Block from 'src/components/layout/Block'
import styled from 'styled-components'
import { lg } from 'src/theme/variables'
import Heading from 'src/components/layout/Heading'

// Other settings sections use MUI createStyles .container
// will adjust that during dark mode implementation
const Container = styled(Block)`
  padding: ${lg};
`

const SafeAppsPermissions = (): ReactElement => {
  return (
    <Container>
      <Heading tag="h2">Safe Apps Permissions</Heading>
    </Container>
  )
}

export default SafeAppsPermissions
