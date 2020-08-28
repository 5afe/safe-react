// source: https://github.com/final-form/react-final-form/issues/369#issuecomment-439823584

import React from 'react'
import { Field } from 'react-final-form'

const DebounceValidationField = ({ debounce = 1000, validate, ...rest }: any) => {
  let clearTimeout

  const localValidation = (value, values, fieldState) => {
    if (fieldState.active) {
      return new Promise((resolve) => {
        if (clearTimeout) clearTimeout()
        const timerId = setTimeout(() => {
          resolve(validate(value, values, fieldState))
        }, debounce)
        clearTimeout = () => {
          clearTimeout(timerId)
          resolve()
        }
      })
    } else {
      return validate(value, values, fieldState)
    }
  }

  return <Field {...rest} validate={localValidation} />
}

export default DebounceValidationField
