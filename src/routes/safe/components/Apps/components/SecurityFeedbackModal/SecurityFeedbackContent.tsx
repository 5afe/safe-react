import React from 'react'
import styled from 'styled-components'
import { Icon, Text } from '@gnosis.pm/safe-react-components'
import { StyledSecurityTitle, StyledTitle } from './styles'
import { SecurityFeedbackPractice } from '../../types'

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
      <StyledContainer>{imageSrc ? <StyledImage src={imageSrc} alt={title} /> : children}</StyledContainer>

      <StyledTitle size="xs" centered>
        {title}
      </StyledTitle>

      {subtitle && (
        <StyledText size="xl" color="text">
          {subtitle}
        </StyledText>
      )}
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

const StyledText = styled(Text)`
  text-align: center;
`

const StyledImage = styled.img`
  height: 100%;
`

export default SecurityFeedbackContent
