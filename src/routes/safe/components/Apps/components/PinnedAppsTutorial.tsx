import { Icon, Text } from '@gnosis.pm/safe-react-components'
import Card from '@material-ui/core/Card'
import styled from 'styled-components'

const NoAppsFoundTextContainer = styled(Card)`
  display: flex;
  margin-top: ${({ theme }) => theme.margin.md};
  margin-bottom: ${({ theme }) => theme.margin.md};
  box-shadow: 1px 2px 10px 0 rgba(212, 212, 211, 0.59);
  box-sizing: border-box;
  max-width: 100%;
  padding: 52px 54px;
  justify-content: center;
  gap: ${({ theme }) => theme.margin.sm};
`

const StyledIcon = styled(Icon)`
  vertical-align: middle;
`

const PinnedAppsTutorial = (): React.ReactElement => (
  <NoAppsFoundTextContainer>
    <Icon size="md" type="info" />
    <Text size="xl">
      Simply hover over an app and click on the <StyledIcon size="sm" type="bookmark" /> to bookmark the app here for
      convenient access
    </Text>
  </NoAppsFoundTextContainer>
)

export { PinnedAppsTutorial }
