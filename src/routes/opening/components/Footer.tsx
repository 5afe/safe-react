import React, { SyntheticEvent } from 'react'
import styled from 'styled-components'

import Button from 'src/components/layout/Button'
import { getEtherScanLink } from 'src/logic/wallets/getWeb3'
import { connected } from 'src/theme/variables'

const EtherScanLink = styled.a`
  color: ${connected};
`

const ButtonWithMargin = styled(Button)`
  margin-right: 16px;
`

export const GenericFooter = ({ safeCreationTxHash }: { safeCreationTxHash: string }) => (
  <span>
    <p>This process should take a couple of minutes.</p>
    <p>
      Follow the progress on{' '}
      <EtherScanLink
        aria-label="Show details on Etherscan"
        href={getEtherScanLink('tx', safeCreationTxHash)}
        rel="noopener noreferrer"
        target="_blank"
      >
        Etherscan.io
      </EtherScanLink>
      .
    </p>
  </span>
)

export const ContinueFooter = ({
  continueButtonDisabled,
  onContinue,
}: {
  continueButtonDisabled: boolean
  onContinue: (event: SyntheticEvent) => void
}) => (
  <Button
    color="primary"
    disabled={continueButtonDisabled}
    onClick={onContinue}
    variant="contained"
    data-testid="continue-btn"
  >
    Continue
  </Button>
)

export const ErrorFooter = ({
  onCancel,
  onRetry,
}: {
  onCancel: (event: SyntheticEvent) => void
  onRetry: (event: SyntheticEvent) => void
}) => (
  <>
    <ButtonWithMargin onClick={onCancel} variant="contained">
      Cancel
    </ButtonWithMargin>
    <Button color="primary" onClick={onRetry} variant="contained">
      Retry
    </Button>
  </>
)
