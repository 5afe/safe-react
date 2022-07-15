import { Text, Link } from '@gnosis.pm/safe-react-components'
import styled from 'styled-components'

import {
  StyledSecurityTitle,
  StyledTitle,
} from 'src/routes/safe/components/Apps/components/SecurityFeedbackModal/styles'

const LegalDisclaimer = (): JSX.Element => (
  <StyledContainer>
    <StyledSecurityTitle size="lg">Before starting to use Safe dApps...</StyledSecurityTitle>
    <StyledTitle size="sm" bold centered>
      Disclaimer
    </StyledTitle>
    <StyledText size="xl">
      You are now accessing third-party apps, which we do not own, control, maintain or audit. We are not liable for any
      loss you may suffer in connection with interacting with the apps, which is at your own risk.
    </StyledText>
    <br />
    <br />
    <StyledText size="xl">
      You must read our Terms, which contain more detailed provisions binding on you relating to the apps.
    </StyledText>
    <br />
    <br />
    <StyledText size="xl">
      I have read and understood the{' '}
      <StyledLink href="https://gnosis-safe.io/terms" size="xl" rel="noopener noreferrer" target="_blank">
        Terms
      </StyledLink>{' '}
      and this Disclaimer, and agree to be bound by them.
    </StyledText>
  </StyledContainer>
)

const StyledContainer = styled.div`
  p,
  h4 {
    line-height: 24px;
  }
`

const StyledLink = styled(Link)`
  text-decoration: none;
`

const StyledText = styled(Text)`
  text-align: justify;
`

export default LegalDisclaimer
