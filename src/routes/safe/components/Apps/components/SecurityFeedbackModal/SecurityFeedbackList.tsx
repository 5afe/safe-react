import { Box } from '@material-ui/core'
import styled from 'styled-components'
import { Text, Dot, Icon, Title } from '@gnosis.pm/safe-react-components'

import { SecurityFeedbackPractice } from 'src/routes/safe/components/Apps/types'

type SecurityFeedbackListProps = {
  practices: SecurityFeedbackPractice[]
  appUrl: string
}

const SecurityFeedbackList = ({ practices }: SecurityFeedbackListProps): React.ReactElement => {
  return (
    <>
      <StyledIcon size="md" type="privacyPolicy" color="primary" />
      <StyledTitle size="xs">Best security practices when interacting with Safe Apps</StyledTitle>

      {practices.map((practice, index) => (
        <Box key={index} display="flex" marginBottom={2} alignItems="flex-start">
          <StyledDot color="primary">
            <StyledDotText size="sm">{index + 1}</StyledDotText>
          </StyledDot>
          <Box flexDirection="column">
            <Text size="xl">{practice.title}</Text>
            {practice.subtitle && <Text size="xl">{practice.subtitle}</Text>}
          </Box>
        </Box>
      ))}
    </>
  )
}

const StyledIcon = styled(Icon)`
  margin-top: 10px;
`

const StyledTitle = styled(Title)`
  font-weight: bold;
  text-align: center;
`

const StyledDot = styled(Dot)`
  min-width: 19px;
  width: 19px;
  height: 19px;
  margin-right: 19px;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.secondaryHover};
`

const StyledDotText = styled(Text)`
  position: absolute;
  font-size: 11px;
`

export default SecurityFeedbackList
