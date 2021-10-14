import { Text } from '@gnosis.pm/safe-react-components'
import Card from '@material-ui/core/Card'
import BookmarkBorder from '@material-ui/icons/BookmarkBorder'

import styled from 'styled-components'
import InfoIcon from 'src/assets/icons/info.svg'
import Img from 'src/components/layout/Img'

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

const StyledBookmarkIcon = styled(BookmarkBorder)`
  height: 16px;
  vertical-align: middle;
`

const PinnedAppsTutorial = (): React.ReactElement => (
  <NoAppsFoundTextContainer>
    <Img alt="Info" src={InfoIcon} />
    <Text size="xl">
      Simply hover over an app and click on the
      <StyledBookmarkIcon />
      to bookmark the app here for convenient access
    </Text>
  </NoAppsFoundTextContainer>
)

export { PinnedAppsTutorial }
