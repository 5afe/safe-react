import { makeStyles } from '@material-ui/core'
import React, { ReactElement } from 'react'
import Block from 'src/components/layout/Block'
import { lg } from 'src/theme/variables'

export const selectNetworkStepLabel = 'Connect wallet & select network'

function SelectNetworkStep(): ReactElement {
  const classes = useStyles()

  return (
    <Block className={classes.padding}>
      <div>Only in stage env step: SelectNetworkStep</div>
    </Block>
  )
}

export default SelectNetworkStep

export const selectNetworkStepValidations = (values) => {
  const errors = {}
  console.log('Validations for SelectNetworkStep', values)
  return errors
}

const useStyles = makeStyles({
  padding: {
    padding: lg,
  },
})
