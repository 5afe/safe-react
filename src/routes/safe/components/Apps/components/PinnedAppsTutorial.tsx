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
  box-sizing: border-box;
  max-width: 100%;
  padding: 52px 54px;
  background-color: #000;
  border: 2px solid #06fc99;
  justify-content: center;
  gap: ${({ theme }) => theme.margin.sm};
`

const StyledBookmarkIcon = styled(BookmarkBorder)`
  height: 16px;
  vertical-align: middle;
`

const StyledText = styled(Text)`
  color: #06fc99;
`

const PinnedAppsTutorial = (): React.ReactElement => (
  <NoAppsFoundTextContainer>
    <Img alt="Info" src={InfoIcon} />
    <StyledText size="xl">
      Simply hover over an app and click on the
      <StyledBookmarkIcon />
      to bookmark the app here for convenient access
    </StyledText>
  </NoAppsFoundTextContainer>
)

export { PinnedAppsTutorial }
