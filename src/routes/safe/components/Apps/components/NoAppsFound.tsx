import { Text, Button } from '@gnosis.pm/safe-react-components'
import styled from 'styled-components'

const NoAppsFoundTextContainer = styled.div`
  max-width: 650px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: ${({ theme }) => theme.margin.xxl};
  margin-bottom: ${({ theme }) => theme.margin.xxl};

  & > p {
    text-align: center;
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
