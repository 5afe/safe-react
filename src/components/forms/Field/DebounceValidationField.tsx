// source: https://github.com/final-form/react-final-form/issues/369#issuecomment-439823584

import React from 'react'
import { Field } from 'react-final-form'

import { trimSpaces } from 'src/utils/strings'

const DebounceValidationField = ({ debounce = 1000, validate, ...rest }: any) => {
  let clearTimeout

  const localValidation = (value, values, fieldState) => {
    const url = trimSpaces(value)

    if (fieldState.active) {
      return new Promise((resolve) => {
        if (clearTimeout) clearTimeout()
        const timerId = setTimeout(() => {
          resolve(validate(url, values, fieldState))
        }, debounce)
        clearTimeout = () => {
          clearTimeout(timerId)
          resolve()
        }
      })
    } else {
      return validate(url, values, fieldState)
    }
  }

  return <Field {...rest} format={trimSpaces} validate={localValidation} />
}

export default DebounceValidationField
