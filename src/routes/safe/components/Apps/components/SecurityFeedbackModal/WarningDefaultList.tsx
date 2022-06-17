import { Checkbox, Text } from '@gnosis.pm/safe-react-components'
import { useState } from 'react'
import { StyledTitle } from './styles'

type WarningDefaultListProps = {
  onHideWarning: (hideWarning: boolean) => void
}

const WarningDefaultList = ({ onHideWarning }: WarningDefaultListProps): React.ReactElement => {
  const [toggleHideWarning, setToggleHideWarning] = useState(false)

  const handleToggleWarningPreference = (): void => {
    onHideWarning(!toggleHideWarning)
    setToggleHideWarning(!toggleHideWarning)
  }

  return (
    <>
      <StyledTitle size="sm">Warning</StyledTitle>
      <Text size="xl" color="error">
        The application you are trying to use is not in our default list
      </Text>
      <br />
      <Text size="lg">Check the link you are using and ensure it comes from a trusted source</Text>
      <Checkbox
        name="Warning message preference"
        label="Do not show this warning again"
        checked={toggleHideWarning}
        onChange={handleToggleWarningPreference}
      />
    </>
  )
}

export default WarningDefaultList
