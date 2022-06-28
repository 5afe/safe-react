import { Box } from '@material-ui/core'
import styled from 'styled-components'
import { Text, Dot, Icon } from '@gnosis.pm/safe-react-components'
import { StyledSecurityTitle, StyledTitle } from './styles'
import { SecurityFeedbackPractice } from '../../types'

type SecurityFeedbackListProps = {
  practices: SecurityFeedbackPractice[]
  appUrl: string
}

const SecurityFeedbackList = ({ practices, appUrl }: SecurityFeedbackListProps): React.ReactElement => {
  return (
    <>
      <Icon size="md" type="privacyPolicy" />
      <StyledSecurityTitle size="lg">
        Secure your activity with Safe dApps by following simple rules
      </StyledSecurityTitle>
      <StyledTitle size="sm" centered>
        Best security practices when interacting with Safe Apps
      </StyledTitle>

      {practices.map((practice, index) => (
        <Box key={index} display="flex" marginBottom={2} alignItems="flex-start">
          <StyledDot color="primary">
            <StyledDotText size="sm">{index + 1}</StyledDotText>
          </StyledDot>
          <Box flexDirection="column">
            <Text size="lg">{practice.title}</Text>
            {practice.subtitle && <Text size="lg">{practice.subtitle}</Text>}
            {!practice.imageSrc && (
              <StyledText size="lg">
                <b>{appUrl}</b>
              </StyledText>
            )}
          </Box>
        </Box>
      ))}
    </>
  )
}

const StyledDot = styled(Dot)`
  min-width: 20px;
  width: 20px;
  height: 20px;
  margin-right: 20px;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.secondaryHover};
`

const StyledDotText = styled(Text)`
  position: absolute;
  font-size: 10px;
`

const StyledText = styled(Text)`
  overflow-wrap: anywhere;
  margin: 10px 0;
`

export default SecurityFeedbackList
