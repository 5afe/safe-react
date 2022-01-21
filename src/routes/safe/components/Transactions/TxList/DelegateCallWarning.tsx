import { Text } from '@gnosis.pm/safe-react-components'
import { ReactElement } from 'react'

const DelegateCallWarning = ({ showWarning }: { showWarning: boolean }): ReactElement => {
  if (showWarning) {
    return (
      <Text size="xl" strong as="span" color="error">
        ⚠️ Unexpected Delegate Call
      </Text>
    )
  }
  return (
    <Text size="xl" strong as="span">
      Delegate Call
    </Text>
  )
}

export default DelegateCallWarning
