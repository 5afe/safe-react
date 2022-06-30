import React from 'react'
import styled from 'styled-components'
import { Icon, Title } from '@gnosis.pm/safe-react-components'

import { StyledSecurityTitle } from 'src/routes/safe/components/Apps/components/SecurityFeedbackModal/styles'
import { SecurityFeedbackPractice } from 'src/routes/safe/components/Apps/types'

type SecurityFeedbackContentProps = Omit<SecurityFeedbackPractice, 'id'>

const SecurityFeedbackContent: React.FC<SecurityFeedbackContentProps> = ({
  title,
  subtitle,
  imageSrc,
  children,
}): React.ReactElement => {
  return (
    <>
      <Icon size="md" type="privacyPolicy" />
      <StyledSecurityTitle size="lg">
        Secure your activity with Safe dApps by following simple rules
      </StyledSecurityTitle>

      {imageSrc ? (
        <StyledImageContainer>
          <StyledImage src={imageSrc} alt={title} />
        </StyledImageContainer>
      ) : (
        <StyledContentContainer>{children}</StyledContentContainer>
      )}

      <StyledTextContainer>
        <StyledTitle size="xs">{title}</StyledTitle>
        {subtitle && <StyledTitle size="xs">{subtitle}</StyledTitle>}
      </StyledTextContainer>
    </>
  )
}

const StyledContentContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 160px;
`

const StyledImageContainer = styled(StyledContentContainer)`
  height: 190px;
  padding: 0 30px;
`

const StyledTextContainer = styled.div`
  margin: 40px 20px 64px 20px;
`

const StyledTitle = styled(Title)`
  text-align: center;
`

const StyledImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  margin-top: 15px;
`

export default SecurityFeedbackContent
