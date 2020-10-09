import React, { SyntheticEvent } from 'react'
import styled from 'styled-components'

import Button from 'src/components/layout/Button'
import { connected } from 'src/theme/variables'
import { getExplorerInfo } from 'src/config'

const ExplorerLink = styled.a`
  color: ${connected};
`

const ButtonWithMargin = styled(Button)`
  margin-right: 16px;
`

export const GenericFooter = ({ safeCreationTxHash }: { safeCreationTxHash: string }) => {
  const explorerInfo = getExplorerInfo(safeCreationTxHash)
  const { url, alt } = explorerInfo()
  const match = /(http|https):\/\/(\w+\.\w+)\/.*/i.exec(url)
  const explorerDomain = match !== null ? match[2] : 'Network Explorer'

  return (
    <span>
      <p>This process should take a couple of minutes.</p>
      <p>
        Follow the progress on{' '}
        <ExplorerLink
          aria-label={alt}
          href={url}
          rel="noopener noreferrer"
          target="_blank"
          data-testid="safe-create-explorer-link"
        >
          {explorerDomain}
        </ExplorerLink>
        .
      </p>
    </span>
  )
}

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
