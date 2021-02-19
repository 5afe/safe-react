import React, { SyntheticEvent } from 'react'
import styled from 'styled-components'

import { ButtonLink, Link, Text } from '@gnosis.pm/safe-react-components'

import Button from 'src/components/layout/Button'
import { getExplorerInfo } from 'src/config'
import Hairline from 'src/components/layout/Hairline'

const StyledButtonLink = styled(ButtonLink)`
  display: inline-flex;
  padding: 0 0 0 8px;
`
const StyledText = styled(Text)`
  display: inline-flex;
`
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

export const GenericFooter = ({ safeCreationTxHash }: { safeCreationTxHash: string }) => {
  const explorerInfo = getExplorerInfo(safeCreationTxHash)
  const { url, alt } = explorerInfo()
  const match = /(http|https):\/\/(\w+\.\w+)\/.*/i.exec(url)
  const explorerDomain = match !== null ? match[2] : 'Network Explorer'

  return (
    <span>
      <Text size="xl">This process should take a couple of minutes.</Text>
      <StyledText size="xl">
        Follow the progress on{' '}
        <StyledButtonLink textSize="xl" color="primary" iconType="externalLink" iconSize="sm">
          <Link
            size="xl"
            aria-label={alt}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="safe-create-explorer-link"
            title="More info about this in Etherscan"
          >
            {explorerDomain}
          </Link>
        </StyledButtonLink>
      </StyledText>
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
  <FooterContainer>
    <Hairline />
    <Button
      color="primary"
      disabled={continueButtonDisabled}
      onClick={onContinue}
      variant="contained"
      data-testid="continue-btn"
    >
      Get started
    </Button>
  </FooterContainer>
)

export const ErrorFooter = ({
  onCancel,
  onRetry,
}: {
  onCancel: (event: SyntheticEvent) => void
  onRetry: (event: SyntheticEvent) => void
}) => (
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
