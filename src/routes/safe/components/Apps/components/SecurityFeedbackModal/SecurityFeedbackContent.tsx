import React from 'react'
import { Grid } from '@material-ui/core'
import styled from 'styled-components'
import { StyledTitle } from './styles'
import { SecurityFeedbackPractice } from '../../types'

type SecurityFeedbackContentProps = Omit<SecurityFeedbackPractice, 'id'>

const SecurityFeedbackContent: React.FC<SecurityFeedbackContentProps> = ({
  title,
  imageSrc,
  children,
}): React.ReactElement => {
  return (
    <Grid container direction="column" alignItems="center" justifyContent="center">
      <StyledTitle size="xs" centered>
        {title}
      </StyledTitle>
      {children}
      {imageSrc && <StyledImage src={imageSrc} alt={title} />}
    </Grid>
  )
}

const StyledImage = styled.img`
  height: 100%;
  width: 90%;
`

export default SecurityFeedbackContent
