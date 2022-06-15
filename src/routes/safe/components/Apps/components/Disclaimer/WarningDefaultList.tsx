import { Text } from '@gnosis.pm/safe-react-components'
import { StyledTitle } from './styles'

const WarningDefaultList = (): JSX.Element => (
  <>
    <StyledTitle size="sm">Warning</StyledTitle>
    <Text size="xl" color="error">
      The application you are trying to use is not in our default list
    </Text>
    <br />
    <Text size="lg">Check the link you are using and ensure it comes from a trusted source</Text>
  </>
)

export default WarningDefaultList
