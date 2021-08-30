import React, { ReactElement } from 'react'

export const selectNetworkStepLabel = 'Connect wallet & select network'

function SelectNetworkStep(): ReactElement {
  return (
    <div>
      <div>Only in stage env step: SelectNetworkStep</div>
    </div>
  )
}

export default SelectNetworkStep

export const selectNetworkStepValidations = (values) => {
  const errors = {}
  console.log('Validations for SelectNetworkStep', values)
  return errors
}
