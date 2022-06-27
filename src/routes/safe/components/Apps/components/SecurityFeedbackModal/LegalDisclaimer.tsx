import { Text, Link } from '@gnosis.pm/safe-react-components'
import styled from 'styled-components'
import { StyledSecurityTitle, StyledTitle } from './styles'

const LegalDisclaimer = (): JSX.Element => (
  <>
    <StyledSecurityTitle size="lg">Before starting to use Safe dApps...</StyledSecurityTitle>
    <StyledTitle size="sm" centered>
      Disclaimer
    </StyledTitle>
    <Text size="lg">
      You are now accessing third-party apps, which we do not own, control, maintain or audit. We are not liable for any
      loss you may suffer in connection with interacting with the apps, which is at your own risk.
    </Text>
    <br />
    <Text size="lg">
      You must read our Terms, which contain more detailed provisions binding on you relating to the apps.
    </Text>
    <br />
    <Text size="lg">
      I have read and understood the{' '}
      <StyledLink href="https://gnosis-safe.io/terms" size="lg" rel="noopener noreferrer" target="_blank" style={{}}>
        Terms
      </StyledLink>{' '}
      and this Disclaimer, and agree to be bound by them.
    </Text>
  </>
)

const StyledLink = styled(Link)`
  text-decoration: none;
`

export default LegalDisclaimer
