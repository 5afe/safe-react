import React from 'react'
import styled from 'styled-components'
import { StyledSecurityTitle, StyledTitle } from './styles'
import { SecurityFeedbackPractice } from '../../types'
import { Icon } from '@gnosis.pm/safe-react-components'

type SecurityFeedbackContentProps = Omit<SecurityFeedbackPractice, 'id'>

const SecurityFeedbackContent: React.FC<SecurityFeedbackContentProps> = ({
  title,
  imageSrc,
  children,
}): React.ReactElement => {
  return (
    <>
      <Icon size="md" type="privacyPolicy" />
      <StyledSecurityTitle size="lg">
        Secure your activity with Safe dApps by following simple rules
      </StyledSecurityTitle>
      <StyledContainer>{imageSrc ? <StyledImage src={imageSrc} alt={title} /> : children}</StyledContainer>

      <StyledTitle size="xs" centered>
        {title}
      </StyledTitle>
    </>
  )
}

const StyledContainer = styled.div`
  height: 170px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 0;
`

const StyledImage = styled.img`
  height: 100%;
`

export default SecurityFeedbackContent
