import React, { ReactElement, SyntheticEvent } from 'react'
import styled from 'styled-components'

import { Icon, Link, Loader, Text } from '@gnosis.pm/safe-react-components'

import Button from 'src/components/layout/Button'
import { getExplorerInfo } from 'src/config'
import Hairline from 'src/components/layout/Hairline'

const StyledText = styled(Text)`
  display: inline-flex;
  a {
    margin-left: 4px;
  }
  svg {
    position: relative;
    top: 4px;
    left: 4px;
  }
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

const LoaderText = styled.span`
  margin-left: 10px;
`

export const GenericFooter = ({ safeCreationTxHash }: { safeCreationTxHash: string }): ReactElement => {
  const explorerInfo = getExplorerInfo(safeCreationTxHash)
  const { url, alt } = explorerInfo()
  const match = /(http|https):\/\/(\w+\.\w+)\/.*/i.exec(url)
  const explorerDomain = match !== null ? match[2] : 'Network Explorer'

  return (
    <span>
      <Text size="xl">This process should take a couple of minutes.</Text>
      <StyledText size="xl">
        Follow the progress on{' '}
        <Link
          href={url}
          aria-label={alt}
          target="_blank"
          rel="noopener noreferrer"
          data-testid="safe-create-explorer-link"
          title="More info about this in Etherscan"
        >
          <Text size="xl" as="span" color="primary">
            {explorerDomain}
          </Text>
          <Icon size="sm" type="externalLink" color="primary" />
        </Link>
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
          <Loader size="xs" color="secondaryLight" /> <LoaderText>Loading your safe</LoaderText>
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
