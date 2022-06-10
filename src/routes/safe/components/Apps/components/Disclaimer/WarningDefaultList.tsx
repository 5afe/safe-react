import { Text } from '@gnosis.pm/safe-react-components'
import { StyledTitle } from './styles'

const WarningDefaultList = (): JSX.Element => (
  <>
    <StyledTitle size="sm">⚠️ Warning</StyledTitle>
    <Text size="lg">The application you are about to access is not in our default list</Text>
  </>
)

export default WarningDefaultList
