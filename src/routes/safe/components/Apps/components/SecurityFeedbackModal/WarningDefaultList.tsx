import { useState } from 'react'
import styled from 'styled-components'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { Text } from '@gnosis.pm/safe-react-components'
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
      <StyledFormControlLabel
        control={
          <Checkbox
            checked={toggleHideWarning}
            onChange={handleToggleWarningPreference}
            name="Warning message preference"
          />
        }
        label="Do not show this warning again"
      />
    </>
  )
}

const StyledFormControlLabel = styled(FormControlLabel)`
  && {
    margin-top: 15px;
    flex-direction: row-reverse;
    justify-self: flex-end;
    display: flex;
  }
`

export default WarningDefaultList
