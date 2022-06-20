import { useState } from 'react'
import Box from '@material-ui/core/Box'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import styled from 'styled-components'
import { Text } from '@gnosis.pm/safe-react-components'
import { StyledTitle } from './styles'

type UnknownAppWarningProps = {
  onHideWarning?: (hideWarning: boolean) => void
}

const UnknownAppWarning = ({ onHideWarning }: UnknownAppWarningProps): React.ReactElement => {
  const [toggleHideWarning, setToggleHideWarning] = useState(false)

  const handleToggleWarningPreference = (): void => {
    onHideWarning?.(!toggleHideWarning)
    setToggleHideWarning(!toggleHideWarning)
  }

  return (
    <Box flexDirection="column">
      <StyledTitle size="sm" color="error" bold centered={!!onHideWarning}>
        ⚠️Warning!
      </StyledTitle>
      <Text size="xl" color="error">
        <b>The application you are trying to use is not in our default list</b>
      </Text>
      <br />
      <Text size="lg">Check the link you are using and ensure it comes from a trusted source</Text>
      {onHideWarning && (
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
      )}
    </Box>
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

export default UnknownAppWarning
