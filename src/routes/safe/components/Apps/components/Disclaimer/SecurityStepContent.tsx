import React from 'react'
import { Grid } from '@material-ui/core'
import styled from 'styled-components'

import { StyledTitle } from './styles'

type SecurityStepContentProps = {
  title: string
  image: string
}

const SecurityStepContent = ({ title, image }: SecurityStepContentProps): React.ReactElement => {
  return (
    <Grid container direction="column" alignItems="center" justifyContent="center">
      <StyledTitle size="xs">{title}</StyledTitle>
      <StyledImage src={image} />
    </Grid>
  )
}

const StyledImage = styled.img`
  height: 100%;
  width: 90%;
`

export default React.memo(SecurityStepContent)
