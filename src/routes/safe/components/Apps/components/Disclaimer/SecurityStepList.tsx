import { Box } from '@material-ui/core'
import styled from 'styled-components'
import { Text, Dot } from '@gnosis.pm/safe-react-components'
import { StyledTitle } from './styles'
import { SECURITY_STEPS } from './utils'

const SecurityStepList = (): React.ReactElement => {
  return (
    <>
      <StyledTitle size="sm">Best security practices when interacting with Safe Apps</StyledTitle>
      {SECURITY_STEPS.map((step, index) => (
        <Box key={index} display="flex" marginBottom={2} alignItems="flex-start">
          <StyledDot color="primary">
            <StyledDotText size="sm">{index + 1}</StyledDotText>
          </StyledDot>
          <Text size="lg">{step.title}</Text>
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
  background: #f0efee;
  color: #566976;
`

const StyledDotText = styled(Text)`
  position: absolute;
  font-size: 10px;
`

export default SecurityStepList
