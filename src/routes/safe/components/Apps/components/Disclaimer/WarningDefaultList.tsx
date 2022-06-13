import { Text } from '@gnosis.pm/safe-react-components'
import { StyledTitle } from './styles'

const WarningDefaultList = (): JSX.Element => (
  <>
    <StyledTitle size="sm">Warning</StyledTitle>
    <Text size="xl" color="error">
      The application you are trying to use is not in our default list
    </Text>
    <br />
    <Text size="lg">
      The <b>default list</b> are applications reviewed and verified for us
    </Text>
  </>
)

export default WarningDefaultList
