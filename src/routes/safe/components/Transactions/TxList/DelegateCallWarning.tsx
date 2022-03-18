import { Text } from '@gnosis.pm/safe-react-components'
import { ReactElement } from 'react'
import { md } from 'src/theme/variables'
import styled from 'styled-components'

const StyledText = styled(Text)`
  margin-bottom: ${md};
`

const DelegateCallWarning = ({ showWarning }: { showWarning: boolean }): ReactElement => {
  if (showWarning) {
    return (
      <StyledText size="xl" strong color="error">
        ⚠️ Unexpected Delegate Call
      </StyledText>
    )
  }
  return (
    <StyledText size="xl" strong>
      Delegate Call
    </StyledText>
  )
}

export default DelegateCallWarning
