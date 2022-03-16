import { ReactElement, SyntheticEvent } from 'react'
import styled from 'styled-components'
import { Loader } from '@gnosis.pm/safe-react-components'

import Button from 'src/components/layout/Button'
import Hairline from 'src/components/layout/Hairline'
import Paragraph from 'src/components/layout/Paragraph'

const ButtonWithMargin = styled(Button)`
  margin-right: 16px;
`
const FooterContainer = styled.div`
  width: 100%;
  height: 76px;

  button {
    margin-top: 24px;
  }
`

const LoaderText = styled.span`
  margin-left: 10px;
`

export const GenericFooter = (): ReactElement => {
  return (
    <Paragraph size="lg" color="primary">
      This process should take a couple of minutes.
    </Paragraph>
  )
}

export const ContinueFooter = ({
  continueButtonDisabled,
  onContinue,
}: {
  continueButtonDisabled: boolean
  onContinue: (event: SyntheticEvent) => void
}): ReactElement => (
  <FooterContainer>
    <Hairline />
    <Button
      color="primary"
      disabled={continueButtonDisabled}
      onClick={onContinue}
      variant="contained"
      data-testid="continue-btn"
    >
      {continueButtonDisabled ? (
        <>
          <Loader size="xs" color="secondaryLight" /> <LoaderText>Loading your Safe</LoaderText>
        </>
      ) : (
        <>Get started</>
      )}
    </Button>
  </FooterContainer>
)

export const ErrorFooter = ({
  onCancel,
  onRetry,
}: {
  onCancel: (event: SyntheticEvent) => void
  onRetry: (event: SyntheticEvent) => void
}): ReactElement => (
  <FooterContainer>
    <Hairline />
    <ButtonWithMargin onClick={onCancel} variant="contained">
      Cancel
    </ButtonWithMargin>
    <Button color="primary" onClick={onRetry} variant="contained">
      Retry
    </Button>
  </FooterContainer>
)
