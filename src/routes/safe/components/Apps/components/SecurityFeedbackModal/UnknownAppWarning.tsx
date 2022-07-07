import { useState } from 'react'
import Box from '@material-ui/core/Box'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import styled from 'styled-components'
import { Text, Icon } from '@gnosis.pm/safe-react-components'

import { StyledTitle } from 'src/routes/safe/components/Apps/components/SecurityFeedbackModal/styles'
import SecurityFeedbackDomain from './SecurityFeedbackDomain'

type UnknownAppWarningProps = {
  url?: string
  onHideWarning?: (hideWarning: boolean) => void
}

const UnknownAppWarning = ({ url, onHideWarning }: UnknownAppWarningProps): React.ReactElement => {
  const [toggleHideWarning, setToggleHideWarning] = useState(false)

  const handleToggleWarningPreference = (): void => {
    onHideWarning?.(!toggleHideWarning)
    setToggleHideWarning(!toggleHideWarning)
  }

  const isColumnLayout = !!onHideWarning

  return (
    <StyledBox
      display={isColumnLayout ? 'flex' : 'block'}
      flexDirection="column"
      height={isColumnLayout ? '100%' : 'auto'}
      alignItems="center"
    >
      <Box display={isColumnLayout ? 'block' : 'flex'} alignItems="center" mt={isColumnLayout ? 6 : 0}>
        <StyledIcon type="alert" size="md" isColumnLayout={isColumnLayout} />
        <StyledWarningTitle size="sm" bold isColumnLayout={isColumnLayout}>
          Warning
        </StyledWarningTitle>
      </Box>
      <StyledWarningText isColumnLayout={isColumnLayout} size="xl">
        The application you are trying to access is not in the default Safe Apps list
      </StyledWarningText>
      <br />
      <StyledText isColumnLayout={isColumnLayout} size="lg">
        Check the link you are using and ensure that it comes from a source you trust
      </StyledText>
      <br />
      {url && <SecurityFeedbackDomain url={url} showInOneLine />}
      <br />
      {onHideWarning && (
        <StyledFormControlLabel
          control={
            <Checkbox
              checked={toggleHideWarning}
              onChange={handleToggleWarningPreference}
              name="Warning message preference"
            />
          }
          label="Don't show this warning again"
        />
      )}
    </StyledBox>
  )
}

const StyledBox = styled(Box)`
  color: #e8663d;
`

const StyledWarningTitle = styled(StyledTitle)<{ isColumnLayout: boolean }>`
  font-size: 24px;
  margin-left: 4px;
  margin-top: ${({ isColumnLayout }) => (isColumnLayout ? '12px' : '24px')};
`

const StyledWarningText = styled(Text)<{ isColumnLayout: boolean }>`
  color: inherit;
  text-align: ${({ isColumnLayout }) => (isColumnLayout ? 'center' : 'left')};
`

const StyledText = styled(Text)<{ isColumnLayout: boolean }>`
  text-align: ${({ isColumnLayout }) => (isColumnLayout ? 'center' : 'left')};
`

const StyledIcon = styled(Icon)<{ isColumnLayout: boolean }>`
  svg {
    width: ${({ isColumnLayout }) => (isColumnLayout ? '32px' : '24px')};
    height: ${({ isColumnLayout }) => (isColumnLayout ? '32px' : '24px')};
  }
  .icon-color {
    fill: #e8663d;
  }

  .icon-stroke {
    stroke: #e8663d;
  }
`

const StyledFormControlLabel = styled(FormControlLabel)`
  flex: 1;
  color: #000;
  .MuiIconButton-root:not(.Mui-checked) {
    color: ${({ theme }) => theme.colors.inputDisabled};
  }
`

export default UnknownAppWarning
