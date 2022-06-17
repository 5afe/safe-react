import React from 'react'
import { Grid } from '@material-ui/core'
import styled from 'styled-components'
import { StyledTitle } from './styles'
import { SecurityStep } from '../../types'

type SecurityStepContentProps = Omit<SecurityStep, 'id'>

const SecurityStepContent: React.FC<SecurityStepContentProps> = ({ title, imageSrc, children }): React.ReactElement => {
  return (
    <Grid container direction="column" alignItems="center" justifyContent="center">
      <StyledTitle size="xs">{title}</StyledTitle>
      {children}
      {imageSrc && <StyledImage src={imageSrc} alt={title} />}
    </Grid>
  )
}

const StyledImage = styled.img`
  height: 100%;
  width: 90%;
`

export default SecurityStepContent
