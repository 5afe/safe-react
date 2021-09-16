import { Text } from '@gnosis.pm/safe-react-components'
import InfoIcon from '@material-ui/icons/Info'
import styled from 'styled-components'

const NoAppsFoundTextContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: ${({ theme }) => theme.margin.xxl};
  margin-bottom: ${({ theme }) => theme.margin.xxl};

  & > svg {
    margin-right: ${({ theme }) => theme.margin.sm};
  }
`
type Props = {
  query: string
}

const NoAppsFound = ({ query }: Props): React.ReactElement => (
  <NoAppsFoundTextContainer>
    <InfoIcon />
    <Text size="xl">
      No apps found matching <b>{query}</b>
    </Text>
  </NoAppsFoundTextContainer>
)

export { NoAppsFound }
