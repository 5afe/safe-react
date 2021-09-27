import { Text, Button } from '@gnosis.pm/safe-react-components'
import InfoIcon from '@material-ui/icons/Info'
import styled from 'styled-components'

const NoAppsFoundTextContainer = styled.div`
  max-width: 650px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-top: ${({ theme }) => theme.margin.xxl};
  margin-bottom: ${({ theme }) => theme.margin.xxl};

  & > p {
    flex: 1 90%;
  }

  & > svg {
    flex: 0 7%;
  }
`

const SButton = styled(Button)`
  margin-top: ${({ theme }) => theme.margin.md};
  max-width: 300px;
`

type Props = {
  query: string
  onWalletConnectSearch: () => void
}

const NoAppsFound = ({ query, onWalletConnectSearch }: Props): React.ReactElement => (
  <NoAppsFoundTextContainer>
    <InfoIcon />
    <Text size="xl">
      No apps found matching <b>{query}</b>. Connect to dApps that haven&apos;t yet been integrated with the Safe using
      the WalletConnect App.
    </Text>
    <SButton onClick={onWalletConnectSearch} size="md">
      Search WalletConnect
    </SButton>
  </NoAppsFoundTextContainer>
)

export { NoAppsFound }
