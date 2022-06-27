import { useState } from 'react'
import Box from '@material-ui/core/Box'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import styled from 'styled-components'
import { Text, Icon } from '@gnosis.pm/safe-react-components'
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
    <StyledBox display="flex" flexDirection="column" height="100%" alignItems="center" mt={8}>
      <StyledIcon type="alert" size="md" />
      <StyledTitle size="sm" bold centered={!!onHideWarning}>
        Warning
      </StyledTitle>
      <StyledWarningText size="xl">The application you are trying to use is not on our approved list</StyledWarningText>
      <br />
      <StyledText size="lg">Check the link you are using and ensure it comes from a trusted source</StyledText>
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
    </StyledBox>
  )
}

const StyledBox = styled(Box)`
  color: #e8663d;
`

const StyledWarningText = styled(Text)`
  color: inherit;
  text-align: center;
`

const StyledText = styled(Text)`
  text-align: center;
`

const StyledIcon = styled(Icon)``

const StyledFormControlLabel = styled(FormControlLabel)`
  flex: 1;
  color: #000;
`

export default UnknownAppWarning
